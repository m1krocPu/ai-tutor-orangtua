import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

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

// Text-to-Speech Bahasa Indonesia (Web Speech API)
export function bicara(teks, onWord, onEnd) {
  if (!("speechSynthesis" in window)) return null;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(teks);
  u.lang = "id-ID";
  u.rate = 0.95;
  u.pitch = 1.05;
  if (onWord) {
    u.onboundary = (ev) => onWord(ev.charIndex);
  }
  u.onend = () => onEnd && onEnd();
  window.speechSynthesis.speak(u);
  return u;
}

export function stopBicara() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
