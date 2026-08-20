"""Backend API tests for TutorOrangTua AI.

Covers:
- GET /api/status-ai  (Gemini via Emergent LLM Key active check)
- POST /api/bimbing   (text and photo modes → Kartu Panduan JSON in Bahasa Indonesia)
- POST /api/curhat    (warm Indonesian parenting reply)
- POST /api/tanya-spontan (short analogy)
"""
import base64
import os
import pytest
import requests

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"

TIMEOUT_SHORT = 30
TIMEOUT_LONG = 120  # LLM (esp. vision) can take a while


@pytest.fixture(scope="module")
def homework_image_b64():
    """A JPEG with real Indonesian homework text (Kurikulum Merdeka style)."""
    path = "/tmp/homework.jpg"
    with open(path, "rb") as f:
        raw = f.read()
    return base64.b64encode(raw).decode("ascii")


# ------------------------- /api/status-ai -------------------------

class TestStatusAI:
    def test_status_ai_ok(self):
        r = requests.get(f"{API}/status-ai", timeout=TIMEOUT_SHORT)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("ai_aktif") is True, f"Expected ai_aktif=true, got {data}"
        assert data.get("model") == "gemini-2.5-flash", data


# ------------------------- /api/bimbing (teks) -------------------------

class TestBimbingTeks:
    def test_bimbing_teks_returns_full_kartu(self):
        payload = {
            "mode": "teks",
            "teks_soal": "Ibu punya 1 martabak yang dipotong menjadi 8 bagian. Kakak memakan 3 potong. Berapa sisa potongannya?",
            "mata_pelajaran": "Matematika",
            "jenjang": "Kelas 4 SD",
            "panggilan": "Bunda",
            "gaya_belajar": "Visual",
            "suasana_hati": "Semangat",
        }
        r = requests.post(f"{API}/bimbing", json=payload, timeout=TIMEOUT_LONG)
        assert r.status_code == 200, r.text
        data = r.json()

        # Structural
        assert "daftar_soal" in data, data
        assert isinstance(data["daftar_soal"], list) and len(data["daftar_soal"]) >= 1
        soal = data["daftar_soal"][0]

        for key in ["konsep_kurikulum", "analogi_dapur", "skrip_sokratik",
                    "skrip_penjinak_emosi", "kunci_jawaban_orang_tua"]:
            assert key in soal, f"Missing key {key} in daftar_soal[0]: {list(soal.keys())}"

        # Sokratik 3 langkah
        skrip = soal["skrip_sokratik"]
        assert isinstance(skrip, list) and len(skrip) == 3, f"expected 3 langkah, got {skrip}"
        for step in skrip:
            assert "tanya_anak" in step and step["tanya_anak"], step

        # Kunci jawaban
        kunci = soal["kunci_jawaban_orang_tua"]
        assert "langkah_matematis" in kunci and "jawaban_akhir" in kunci

        # Bahasa Indonesia sanity — reply should contain some Indonesian tokens
        blob = (
            (soal.get("konsep_kurikulum") or "") + " " +
            (soal.get("analogi_dapur") or "") + " " +
            (soal.get("skrip_penjinak_emosi") or "")
        ).lower()
        indo_hits = sum(w in blob for w in ["yang", "yuk", "kakak", "bunda", "adik", "kita",
                                            "coba", "dengan", "untuk", "anak", "sayang",
                                            "dulu", "ya"])
        assert indo_hits >= 3, f"Reply doesn't look Bahasa Indonesia: {blob[:400]}"

        # Should be real Gemini (not offline fallback) — accept but flag offline
        assert data.get("sumber") in ("gemini", "offline"), data.get("sumber")
        assert data.get("sumber") == "gemini", (
            f"AI returned offline fallback (expected gemini). "
            f"kunci_jawaban_orang_tua langkah_matematis: {kunci.get('langkah_matematis')[:200]}"
        )

    def test_bimbing_teks_kosong_returns_400(self):
        r = requests.post(f"{API}/bimbing", json={"mode": "teks", "teks_soal": ""},
                          timeout=TIMEOUT_SHORT)
        assert r.status_code == 400, r.text


# ------------------------- /api/bimbing (foto) -------------------------

class TestBimbingFoto:
    def test_bimbing_foto_reads_homework(self, homework_image_b64):
        payload = {
            "mode": "foto",
            "image_base64": homework_image_b64,
            "mata_pelajaran": "Matematika",
            "jenjang": "Kelas 4 SD",
            "panggilan": "Bunda",
            "gaya_belajar": "Visual",
            "suasana_hati": "Semangat",
        }
        r = requests.post(f"{API}/bimbing", json=payload, timeout=TIMEOUT_LONG)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "daftar_soal" in data
        assert data.get("sumber") == "gemini", (
            f"Vision returned offline fallback. Full: {str(data)[:400]}"
        )
        soal = data["daftar_soal"][0]
        for key in ["konsep_kurikulum", "analogi_dapur", "skrip_sokratik",
                    "kunci_jawaban_orang_tua"]:
            assert key in soal

        # Vision proof: the image contains the words 'martabak' + '8' + '3'.
        # A real read of the image should surface at least one of those.
        blob = str(data).lower()
        assert any(t in blob for t in ["martabak", "8", "delapan", "3", "tiga", "potong"]), (
            f"Vision reply doesn't reference image content: {blob[:400]}"
        )

    def test_bimbing_foto_bad_base64_returns_400(self):
        r = requests.post(f"{API}/bimbing", json={
            "mode": "foto",
            "image_base64": "!!!not-base64!!!",
            "teks_soal": None,
        }, timeout=TIMEOUT_SHORT)
        assert r.status_code == 400, r.text


# ------------------------- /api/curhat -------------------------

class TestCurhat:
    def test_curhat_returns_warm_indonesian(self):
        payload = {
            "pertanyaan": "Anak saya sering menangis kalau salah mengerjakan PR matematika. Bagaimana cara menenangkannya?",
            "riwayat": [],
        }
        r = requests.post(f"{API}/curhat", json=payload, timeout=TIMEOUT_LONG)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "jawaban" in data and isinstance(data["jawaban"], str)
        assert len(data["jawaban"]) > 40, data["jawaban"]
        assert data.get("sumber") == "gemini", f"curhat used offline: {data}"
        low = data["jawaban"].lower()
        assert any(w in low for w in ["bunda", "ayah", "kakak", "adik", "anak", "sayang"]), low[:300]


# ------------------------- /api/tanya-spontan -------------------------

class TestTanyaSpontan:
    def test_spontan_returns_short_analogy(self):
        payload = {
            "konteks_soal": "Pecahan martabak dipotong 8, dimakan 3 potong.",
            "pertanyaan_anak": "Bun, kenapa sih harus dipecah? Aku pusing.",
            "panggilan": "Bunda",
        }
        r = requests.post(f"{API}/tanya-spontan", json=payload, timeout=TIMEOUT_LONG)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "jawaban" in data and data["jawaban"].strip()
        assert data.get("sumber") == "gemini", f"spontan used offline: {data}"
