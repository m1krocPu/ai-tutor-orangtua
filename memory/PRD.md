# PRD — TutorOrangTua AI 🇮🇩

## Problem Statement (asli)
Aplikasi web mobile-first "TutorOrangTua AI" (Tagline: "Co-Pilot Bimbing PR & Parenting Kurikulum Merdeka Terlengkap"). Membantu orang tua Indonesia membimbing PR anak SD-SMP (Kurikulum Merdeka) memakai Google Gemini AI Vision. UI 100% Bahasa Indonesia, gaya hangat keluarga (Bunda/Ayah/Kakak/Adik). Metode sokratik anti-contekan (kunci jawaban terlindungi child-proof lock).

## User Choices
- LLM: Emergent LLM Key bawaan (Gemini `gemini-2.5-flash`) — langsung aktif tanpa setup.
- 6 foto soal contoh: gambar ilustrasi AI (generated).
- TTS: Web Speech API browser (id-ID).
- Riwayat & kunci API pribadi: localStorage.
- Tema: Hijau Zamrud #0F766E, Kuning Hangat #F59E0B, Krem #FFFBEB.

## Arsitektur
- Frontend: React (mobile-first, max-w-md), Tailwind, framer-motion, lucide-react, canvas-confetti, react-fast-marquee.
- Backend: FastAPI + emergentintegrations (LlmChat, Gemini vision + text). Endpoint `/api/*`.
- MongoDB tersedia (belum dipakai — riwayat di localStorage).
- Mode Cadangan Cerdas: fallback JSON contoh bila AI gagal/kuota habis (`sumber=offline`).

## Persona
- Bunda/Ayah yang ingin mendampingi PR anak tanpa stres & tanpa memberi jawaban langsung.
- Juri lomba yang menguji via laptop (disediakan galeri 6 foto soal siap uji).

## Core Requirements (static)
1. Foto & Bimbing PR (kamera capture=environment, galeri, teks manual, galeri contoh).
2. Kartu Panduan Bunda/Ayah: konsep kurikulum, analogi dapur, skrip sokratik 3 langkah, penjinak emosi, tanya spontan, kunci jawaban (child-proof lock).
3. Pustaka Topik Kurikulum Merdeka per Fase A/B/C/D (klik = kartu instan).
4. Ruang Curhat parenting (chat AI + konsultasi cepat 1-klik).
5. Header: banner lomba + upvote, Demo Otomatis 60 detik, Kunci API, Kalkulator Penghematan, Rencana Bisnis, Simulasi Marah vs Sabar, Riwayat.
6. Bilah aksi: WhatsApp, Putar Suara (TTS), Cetak PDF, Upvote.

## Implemented (2026-06)
- [x] Backend endpoints: `/api/status-ai`, `/api/bimbing` (foto+teks), `/api/curhat`, `/api/tanya-spontan` — verified 7/7 pytest.
- [x] Gemini vision membaca foto soal → JSON panduan Bahasa Indonesia.
- [x] Semua tab + kartu panduan + child-proof lock (geser & klik-2x) — verified 10/10 flows.
- [x] Demo overlay otomatis, semua modal header, kalkulator + confetti, upvote.
- [x] Galeri 6 foto soal AI-generated, kompresi kanvas 1280px JPEG.
- [x] Pustaka topik per fase (offline-ready), Curhat chat AI.

## Backlog / Next (P1/P2)
- P1: Rapor perkembangan anak (tracking topik yang sudah dibimbing).
- P1: "Buat Gambar Kutipan untuk Status WA" (render kartu ke gambar).
- P2: Voice premium / narator berkualitas.
- P2: Simpan riwayat ke akun (butuh auth) + sinkronisasi multi-device.
- P2: Perbanyak pustaka hingga 50+ topik terverifikasi guru.

## Catatan
- A11y: warning DialogDescription (non-blocking) tersisa di beberapa modal HeaderMenu — kosmetik konsol saja.
