import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, BookOpen, MessageCircleHeart, X, Sparkles } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { HeaderMenu } from "@/components/HeaderMenu";
import { TabFoto } from "@/components/TabFoto";
import { TabPustaka } from "@/components/TabPustaka";
import { TabCurhat } from "@/components/TabCurhat";
import { statusAI } from "@/lib/api";
import { TOPIK_KURIKULUM } from "@/data/kurikulum";

const TABS = [
  { key: "foto", label: "Bimbing PR", icon: Camera },
  { key: "pustaka", label: "Pustaka", icon: BookOpen },
  { key: "curhat", label: "Curhat", icon: MessageCircleHeart },
];

const DEMO_SCENES = [
  { emoji: "👋", judul: "Selamat Datang!", teks: "Ini demo otomatis TutorOrangTua AI. Duduk manis ya, Bun — biar aplikasi yang bekerja!", durasi: 4500 },
  { emoji: "📸", judul: "1. Foto Soal PR", teks: "Bunda cukup memotret soal PR si Kecil. Misalnya soal pecahan martabak Kelas 4 SD.", durasi: 5000 },
  { emoji: "🧠", judul: "2. AI Gemini Membaca", teks: "AI membaca foto, memetakan nalar Kurikulum Merdeka, lalu meracik analogi dapur yang mudah dipahami.", durasi: 5500 },
  { emoji: "🗣️", judul: "3. Skrip Bimbingan Muncul", teks: "Muncul skrip 3 langkah sokratik — apa yang harus Bunda tanyakan agar anak berpikir sendiri.", durasi: 5500 },
  { emoji: "🔒", judul: "4. Kunci Jawaban Aman", teks: "Kunci jawaban terlindungi. Geser untuk membuka agar tidak diintip si Kecil saat belajar bareng.", durasi: 5000 },
  { emoji: "💚", judul: "Selesai!", teks: "Belajar jadi hangat, sabar, & anti-contekan. Yuk coba sendiri sekarang, Bun!", durasi: 4500 },
];

function App() {
  const [tab, setTab] = useState("foto");
  const [aiAktif, setAiAktif] = useState(true);
  const [riwayat, setRiwayat] = useState([]);
  const [injected, setInjected] = useState(null);
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    statusAI().then((s) => setAiAktif(!!s.ai_aktif));
    try {
      const r = JSON.parse(localStorage.getItem("riwayat_bimbingan") || "[]");
      setRiwayat(r);
    } catch {}
  }, []);

  const simpanRiwayat = useCallback((item) => {
    setRiwayat((prev) => {
      const baru = [item, ...prev].slice(0, 12);
      localStorage.setItem("riwayat_bimbingan", JSON.stringify(baru));
      return baru;
    });
  }, []);

  const bukaRiwayat = (r) => {
    setInjected({ data: r.data, panggilan: r.panggilan, _t: Date.now() });
    setTab("foto");
  };

  // ===== Demo Otomatis =====
  const jalankanDemo = () => {
    setDemoStep(0);
    setDemoActive(true);
    setTab("foto");
    const martabak = TOPIK_KURIKULUM.find((t) => t.id === "b1");
    const soal = {
      judul_singkat: martabak.judul,
      konsep_kurikulum: martabak.konsep,
      analogi_dapur: martabak.analogi,
      skrip_sokratik: martabak.skrip,
      skrip_penjinak_emosi: martabak.emosi,
      kunci_jawaban_orang_tua: { langkah_matematis: martabak.langkah, jawaban_akhir: martabak.jawaban },
    };
    setInjected({ data: { daftar_soal: [soal] }, panggilan: "Bunda", _t: Date.now() });
  };

  useEffect(() => {
    if (!demoActive) return;
    if (demoStep >= DEMO_SCENES.length) {
      setDemoActive(false);
      return;
    }
    const t = setTimeout(() => setDemoStep((s) => s + 1), DEMO_SCENES[demoStep].durasi);
    return () => clearTimeout(t);
  }, [demoActive, demoStep]);

  const totalDemo = DEMO_SCENES.length;

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-background shadow-2xl overflow-x-hidden">
      <HeaderMenu onDemo={jalankanDemo} aiAktif={aiAktif} riwayat={riwayat} onBukaRiwayat={bukaRiwayat} />

      <main className="px-4 pt-4 pb-28">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {tab === "foto" && <TabFoto onSimpanRiwayat={simpanRiwayat} initialHasil={injected} />}
          {tab === "pustaka" && <TabPustaka onSimpanRiwayat={simpanRiwayat} />}
          {tab === "curhat" && <TabCurhat />}
        </motion.div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 backdrop-blur-xl bg-background/90 border-t border-border no-print">
        <div className="grid grid-cols-3 px-2 py-2">
          {TABS.map((t) => {
            const on = tab === t.key;
            return (
              <button
                key={t.key}
                data-testid={`nav-${t.key}`}
                onClick={() => setTab(t.key)}
                className="flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-transform duration-200 active:scale-90"
              >
                <span className={`grid place-items-center w-11 h-8 rounded-full transition-colors ${on ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <t.icon className="w-5 h-5" />
                </span>
                <span className={`text-[11px] font-semibold ${on ? "text-primary" : "text-muted-foreground"}`}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Demo Overlay */}
      <AnimatePresence>
        {demoActive && demoStep < totalDemo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-primary/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
            data-testid="demo-overlay"
          >
            <button
              data-testid="btn-skip-demo"
              onClick={() => setDemoActive(false)}
              className="absolute top-5 right-5 bg-white/20 text-white rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Lewati Demo
            </button>
            <div className="absolute top-5 left-5 flex items-center gap-1.5 text-white/80 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-secondary" /> 🎬 Demo Otomatis 60 Detik
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={demoStep}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-xs"
              >
                <div className="text-7xl mb-5">{DEMO_SCENES[demoStep].emoji}</div>
                <h3 className="font-heading font-extrabold text-2xl text-white mb-3">{DEMO_SCENES[demoStep].judul}</h3>
                <p className="text-white/90 leading-relaxed">{DEMO_SCENES[demoStep].teks}</p>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-10 left-0 right-0 px-10">
              <div className="flex gap-1.5 justify-center">
                {DEMO_SCENES.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === demoStep ? "w-8 bg-secondary" : i < demoStep ? "w-4 bg-white/70" : "w-4 bg-white/25"}`} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
