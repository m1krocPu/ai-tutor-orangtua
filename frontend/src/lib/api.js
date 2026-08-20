import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

// Kompresi gambar via canvas: maks 1280px, JPEG
export function compressImageFile(file, maxSize = 1280, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Ambil gambar dari URL contoh -> dataURL JPEG (dengan kompresi)
export function urlToCompressedDataURL(url, maxSize = 1280, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Bersihkan header base64
export const bersihkanBase64 = (s) => (s && s.includes(",") ? s.split(",")[1] : s);

export async function mintaBimbingan(payload) {
  const { data } = await axios.post(`${API}/bimbing`, payload, { timeout: 90000 });
  return data;
}

export async function mintaCurhat(pertanyaan, riwayat) {
  const { data } = await axios.post(`${API}/curhat`, { pertanyaan, riwayat }, { timeout: 90000 });
  return data;
}

export async function mintaSpontan(konteks_soal, pertanyaan_anak, panggilan) {
  const { data } = await axios.post(
    `${API}/tanya-spontan`,
    { konteks_soal, pertanyaan_anak, panggilan },
    { timeout: 60000 }
  );
  return data;
}

export async function statusAI() {
  try {
    const { data } = await axios.get(`${API}/status-ai`, { timeout: 10000 });
    return data;
  } catch {
    return { ai_aktif: false };
  }
}

// Pilih suara Bahasa Indonesia yang paling ramah dan natural
export function pilihSuaraID(preferGender = "female") {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const idVoices = voices.filter((v) => (v.lang || "").toLowerCase().replace("_", "-").startsWith("id"));
  
  if (idVoices.length === 0) return null;

  if (preferGender === "female") {
    return (
      idVoices.find((v) => /natural|online|neural/i.test(v.name) && /gadis|female|wanita|perempuan/i.test(v.name)) ||
      idVoices.find((v) => /google/i.test(v.name)) ||
      idVoices.find((v) => /gadis|damayanti|sari|female|wanita/i.test(v.name)) ||
      idVoices[0]
    );
  } else {
    return (
      idVoices.find((v) => /natural|online|neural/i.test(v.name) && /ardi|male|pria|laki/i.test(v.name)) ||
      idVoices.find((v) => /ardi|andika|male|pria/i.test(v.name)) ||
      idVoices[0]
    );
  }
}

// Bersihkan teks dari simbol markdown dan tanda kurung berlebih agar intonasi TTS lancar
function bersihkanTeksUntukTTS(teks) {
  if (!teks) return "";
  return teks
    .replace(/\*+/g, "") // Hapus tanda tebal asterisks
    .replace(/["“”]/g, "") // Hapus tanda kutip ganda
    .replace(/[()]/g, ", ") // Ubah kurung jadi koma agar ada jeda nafas alami
    .replace(/\s+/g, " ")
    .trim();
}

let cancelCurrentNarasi = null;

// Narasikan panduan segmen-demi-segmen dengan suara ramah & intonasi hangat
export function narasikan(segments, onSegStart, onEnd, onError, preferGender = "female") {
  if (!("speechSynthesis" in window)) {
    onError && onError();
    return false;
  }

  // Hentikan narasi sebelumnya
  stopBicara();

  let dibatalkan = false;
  cancelCurrentNarasi = () => {
    dibatalkan = true;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const voice = pilihSuaraID(preferGender);
  let i = 0;
  let adaSukses = false;

  const next = () => {
    if (dibatalkan) return;
    if (i >= segments.length) {
      if (!adaSukses && onError) onError();
      else onEnd && onEnd();
      cancelCurrentNarasi = null;
      return;
    }
    const seg = segments[i];
    const teksBersih = bersihkanTeksUntukTTS(seg.teks);
    const u = new SpeechSynthesisUtterance(teksBersih);
    u.lang = "id-ID";
    // Intonasi hangat dan santun
    u.rate = 0.95;
    u.pitch = 1.02;
    u.volume = 1;
    if (voice) u.voice = voice;

    u.onstart = () => {
      if (dibatalkan) return;
      adaSukses = true;
      onSegStart && onSegStart(seg.id, i);
    };

    u.onend = () => {
      if (dibatalkan) return;
      i += 1;
      next();
    };

    u.onerror = (ev) => {
      if (dibatalkan || ev.error === "canceled" || ev.error === "interrupted") return;
      i += 1;
      next();
    };

    onSegStart && onSegStart(seg.id, i);
    window.speechSynthesis.speak(u);
  };

  next();
  return true;
}

// Text-to-Speech Bahasa Indonesia (Web Speech API)
export function bicara(teks, onWord, onEnd) {
  if (!("speechSynthesis" in window)) return null;
  stopBicara();
  const u = new SpeechSynthesisUtterance(bersihkanTeksUntukTTS(teks));
  u.lang = "id-ID";
  u.rate = 0.96;
  u.pitch = 1.02;
  const voice = pilihSuaraID("female");
  if (voice) u.voice = voice;
  if (onWord) {
    u.onboundary = (ev) => onWord(ev.charIndex);
  }
  u.onend = () => onEnd && onEnd();
  window.speechSynthesis.speak(u);
  return u;
}

export function stopBicara() {
  if (cancelCurrentNarasi) {
    cancelCurrentNarasi();
    cancelCurrentNarasi = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
