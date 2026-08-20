from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import logging
import base64
import binascii
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
GEMINI_MODEL = "gemini-2.5-flash"

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------------------- System Prompts ----------------------

SISTEM_PROMPT_PR = """Anda adalah TutorOrangTua AI, pakar pedagogi Kurikulum Merdeka dan konsultan parenting keluarga di Indonesia.
Setiap respons WAJIB dalam format JSON murni (tanpa teks lain, tanpa markdown code fence) dengan skema berikut dan 100% BERBAHASA INDONESIA:
{
  "is_school_question": true,
  "non_school_message": "",
  "daftar_soal": [
    {
      "nomor_soal": 1,
      "judul_singkat": "string",
      "konsep_kurikulum": "string",
      "analogi_dapur": "string",
      "skrip_sokratik": [
        { "langkah": 1, "tanya_anak": "string", "jika_anak_salah": "string" },
        { "langkah": 2, "tanya_anak": "string", "jika_anak_salah": "string" },
        { "langkah": 3, "tanya_anak": "string", "jika_anak_salah": "string" }
      ],
      "skrip_penjinak_emosi": "string",
      "kunci_jawaban_orang_tua": {
        "langkah_matematis": "string",
        "jawaban_akhir": "string"
      }
    }
  ]
}

Jika gambar/teks BUKAN soal sekolah, set "is_school_question": false, isi "non_school_message" dengan pesan ramah, dan "daftar_soal": [].
Jika ada beberapa soal dalam satu foto, buat satu objek untuk setiap soal di dalam "daftar_soal".

PEDOMAN GAYA BAHASA & KATA:
- Bertindaklah sebagai orang tua yang penuh kasih, sabar, dan hangat (Bunda/Ayah).
- JANGAN GUNAKAN istilah akademis yang kaku ('berdasarkan rumus', 'siswa diwajibkan').
- Gunakan bahasa percakapan rumah tangga yang akrab: 'Kak', 'Adik', 'Yuk coba bayangkan...', 'Wah pintar sekali!'.
- Dilarang memberikan jawaban langsung pada pertanyaan sokratik untuk anak (kunci jawaban hanya di bagian kunci_jawaban_orang_tua).
- Analogi WAJIB memakai benda dapur & rumah tangga (martabak, piring, biskuit, lego, botol air, sendok)."""

SISTEM_PROMPT_CURHAT = """Anda adalah TutorOrangTua AI, seorang psikolog anak & konsultan parenting keluarga Indonesia yang hangat, sabar, dan penuh empati.
Jawablah pertanyaan orang tua (Bunda/Ayah) dengan bahasa Indonesia yang santun, hangat, dan praktis.
Berikan saran konkret berupa contoh kalimat yang bisa langsung diucapkan ke anak (Kakak/Adik).
Gunakan sapaan hangat, hindari istilah akademis yang kaku. Jawaban ringkas namun bermakna, boleh memakai poin-poin pendek."""


def _bersihkan_base64(s: str) -> str:
    if not s:
        return s
    if ',' in s and s.strip().startswith('data:'):
        s = s.split(',', 1)[1]
    return s.strip()


def _ekstrak_json(teks: str) -> dict:
    if not teks:
        raise ValueError("kosong")
    t = teks.strip()
    t = re.sub(r'^```(?:json)?', '', t).strip()
    t = re.sub(r'```$', '', t).strip()
    start = t.find('{')
    end = t.rfind('}')
    if start != -1 and end != -1:
        t = t[start:end + 1]
    return json.loads(t)


def _buat_chat(system_message: str) -> LlmChat:
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=str(uuid.uuid4()),
        system_message=system_message,
    ).with_model("gemini", GEMINI_MODEL)


# ---------------------- Models ----------------------

class BimbingRequest(BaseModel):
    mode: str = "foto"
    image_base64: Optional[str] = None
    teks_soal: Optional[str] = None
    mata_pelajaran: str = "Matematika"
    jenjang: str = "Kelas 4 SD"
    panggilan: str = "Bunda"
    gaya_belajar: str = "Visual"
    suasana_hati: str = "Semangat"


class CurhatRequest(BaseModel):
    pertanyaan: str
    riwayat: Optional[List[dict]] = None


class SpontanRequest(BaseModel):
    konteks_soal: str
    pertanyaan_anak: str
    panggilan: str = "Bunda"


# ---------------------- Fallback (Offline Mode) ----------------------

def _fallback_card(mata_pelajaran: str, jenjang: str, konteks: str = "") -> dict:
    judul = konteks[:60] if konteks else f"Soal {mata_pelajaran} {jenjang}"
    return {
        "is_school_question": True,
        "non_school_message": "",
        "sumber": "offline",
        "daftar_soal": [{
            "nomor_soal": 1,
            "judul_singkat": judul or "Panduan Belajar Bersama",
            "konsep_kurikulum": f"Materi ini melatih nalar {mata_pelajaran.lower()} sesuai Kurikulum Merdeka untuk {jenjang}. Tujuannya bukan sekadar menghafal, tapi memahami konsep lewat pengalaman sehari-hari.",
            "analogi_dapur": "Yuk ajak Kakak membayangkan benda di dapur. Misalnya membagi martabak atau menghitung piring, supaya soal terasa nyata dan menyenangkan.",
            "skrip_sokratik": [
                {"langkah": 1, "tanya_anak": "Coba Kakak bacakan soalnya pelan-pelan untuk Bunda ya. Menurut Kakak, soal ini bercerita tentang apa?", "jika_anak_salah": "Tidak apa-apa, Sayang. Yuk kita baca lagi bersama-sama, kata mana yang belum jelas?"},
                {"langkah": 2, "tanya_anak": "Kira-kira, benda apa di rumah kita yang mirip dengan soal ini? Yuk bayangkan bersama.", "jika_anak_salah": "Hmm, coba pikir lagi. Kalau Bunda kasih contoh piring di meja, Kakak bisa hubungkan tidak?"},
                {"langkah": 3, "tanya_anak": "Sekarang, menurut Kakak sendiri, langkah apa dulu yang harus kita lakukan?", "jika_anak_salah": "Pelan-pelan saja, Kak. Coba kita mulai dari yang paling mudah dulu ya."}
            ],
            "skrip_penjinak_emosi": "Peluk dulu Kakak ya, Bun. Katakan: 'Tidak apa-apa salah, itu tandanya kita sedang belajar. Bunda bangga Kakak mau mencoba. Yuk kita coba bareng-bareng, pelan-pelan.'",
            "kunci_jawaban_orang_tua": {
                "langkah_matematis": "Mode offline aktif (kunci API belum diisi atau kuota habis). Sambungkan Kunci API Gemini untuk mendapatkan langkah hitung otomatis yang detail dari foto soal Bunda.",
                "jawaban_akhir": "Silakan aktifkan AI Gemini untuk jawaban presisi. Panduan sokratik di atas tetap bisa langsung Bunda pakai."
            }
        }]
    }


# ---------------------- Routes ----------------------

@api_router.get("/")
async def root():
    return {"message": "TutorOrangTua AI siap membantu Bunda & Ayah!"}


@api_router.get("/status-ai")
async def status_ai():
    return {"ai_aktif": bool(EMERGENT_LLM_KEY), "model": GEMINI_MODEL}


@api_router.post("/bimbing")
async def bimbing(req: BimbingRequest):
    if not EMERGENT_LLM_KEY:
        return _fallback_card(req.mata_pelajaran, req.jenjang, req.teks_soal or "")

    instruksi = (
        f"Konteks: Mata pelajaran {req.mata_pelajaran}, jenjang {req.jenjang}. "
        f"Orang tua ingin dipanggil {req.panggilan}. Gaya belajar anak: {req.gaya_belajar}. "
        f"Suasana hati anak sekarang: {req.suasana_hati}. "
        f"Sesuaikan analogi dengan gaya belajar dan berikan skrip penjinak emosi yang lebih lembut jika anak sedang malas atau menangis. "
        f"Balas HANYA dengan JSON sesuai skema."
    )

    try:
        chat = _buat_chat(SISTEM_PROMPT_PR)
        if req.mode == "foto" and req.image_base64:
            b64 = _bersihkan_base64(req.image_base64)
            try:
                base64.b64decode(b64, validate=True)
            except (binascii.Error, ValueError):
                raise HTTPException(status_code=400, detail="Format foto tidak valid, Bun. Coba unggah ulang ya.")
            msg = UserMessage(
                text=instruksi + " Bacalah semua soal PR dari foto ini dan susun panduannya.",
                file_contents=[ImageContent(image_base64=b64)],
            )
        else:
            soal = (req.teks_soal or "").strip()
            if not soal:
                raise HTTPException(status_code=400, detail="Soalnya belum diisi, Bun.")
            msg = UserMessage(text=instruksi + f" Ini soal PR-nya: \"{soal}\". Susun panduannya.")

        resp = await chat.send_message(msg)
        data = _ekstrak_json(resp)
        data["sumber"] = "gemini"
        return data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Bimbing gagal, pakai fallback: {e}")
        return _fallback_card(req.mata_pelajaran, req.jenjang, req.teks_soal or "")


@api_router.post("/curhat")
async def curhat(req: CurhatRequest):
    if not EMERGENT_LLM_KEY:
        return {"jawaban": "Maaf Bun, koneksi AI sedang tidak aktif. Namun ingat, dekap hangat dan kalimat 'Tidak apa-apa, kita coba lagi ya' seringkali lebih ampuh daripada seribu nasihat. Aktifkan Kunci API Gemini untuk konsultasi lengkap ya.", "sumber": "offline"}
    try:
        chat = _buat_chat(SISTEM_PROMPT_CURHAT)
        konteks = ""
        if req.riwayat:
            for m in req.riwayat[-6:]:
                peran = "Orang tua" if m.get("peran") == "user" else "AI"
                konteks += f"{peran}: {m.get('teks','')}\n"
        teks = (konteks + f"Orang tua: {req.pertanyaan}") if konteks else req.pertanyaan
        resp = await chat.send_message(UserMessage(text=teks))
        return {"jawaban": resp.strip(), "sumber": "gemini"}
    except Exception as e:
        logger.error(f"Curhat gagal: {e}")
        return {"jawaban": "Maaf Bun, AI sedang sibuk. Coba beberapa saat lagi ya. Sementara itu, tarik napas dulu dan peluk si Kecil.", "sumber": "offline"}


@api_router.post("/tanya-spontan")
async def tanya_spontan(req: SpontanRequest):
    if not EMERGENT_LLM_KEY:
        return {"jawaban": "Coba jawab dengan analogi sederhana ya Bun, misalnya pakai benda di sekitar. Aktifkan AI Gemini untuk balasan otomatis.", "sumber": "offline"}
    try:
        sys = SISTEM_PROMPT_CURHAT + " Berikan balasan singkat berupa satu analogi/kalimat yang bisa langsung diucapkan orang tua ke anak."
        chat = _buat_chat(sys)
        teks = f"Konteks soal yang sedang dibahas: {req.konteks_soal}. Anak tiba-tiba bertanya/berkata di luar skrip: \"{req.pertanyaan_anak}\". Bagaimana sebaiknya {req.panggilan} merespon dengan analogi hangat?"
        resp = await chat.send_message(UserMessage(text=teks))
        return {"jawaban": resp.strip(), "sumber": "gemini"}
    except Exception as e:
        logger.error(f"Spontan gagal: {e}")
        return {"jawaban": "Peluk dulu Kakak, lalu jawab dengan analogi benda kesukaannya ya Bun.", "sumber": "offline"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
