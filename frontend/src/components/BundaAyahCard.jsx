import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target, Lightbulb, MessageSquareText, HeartHandshake, KeyRound,
  Volume2, Square, Printer, Share2, Heart, Sparkles, HelpCircle, Send,
} from "lucide-react";
import { ChildProofLock } from "./ChildProofLock";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { mintaSpontan, narasikan, stopBicara } from "../lib/api";
import { toast } from "sonner";

const Section = ({ icon: Icon, judul, tint, children, testid, active }) => (
  <div
    data-testid={testid}
    className={`rounded-2xl border p-4 transition-all duration-300 ${tint} ${
      active ? "border-secondary ring-2 ring-secondary ring-offset-1 scale-[1.01]" : "border-border"
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="grid place-items-center w-8 h-8 rounded-full bg-white/70 shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </span>
      <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
        {judul}
        {active && <span className="text-secondary animate-pulse">🔊</span>}
      </h4>
    </div>
    <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
  </div>
);

export const BundaAyahCard = ({ soal, panggilan = "Bunda", onUpvote }) => {
  const [spontanQ, setSpontanQ] = useState("");
  const [spontanA, setSpontanA] = useState("");
  const [loadingSpontan, setLoadingSpontan] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [segAktif, setSegAktif] = useState(null);

  if (!soal) return null;

  const segmenNarasi = [
    { id: "konsep", teks: `Halo ${panggilan}. Yuk kita pahami dulu konsepnya. ${soal.konsep_kurikulum}` },
    { id: "analogi", teks: `Sekarang, mari pakai analogi sederhana. ${soal.analogi_dapur}` },
    ...soal.skrip_sokratik.map((k, idx) => ({
      id: `skrip-${idx}`,
      teks: `Langkah ke ${k.langkah}. Coba tanyakan pada si Kecil: ${k.tanya_anak}`,
    })),
    { id: "emosi", teks: `Jika si Kecil mulai rewel atau malas, tenangkan dengan lembut. ${soal.skrip_penjinak_emosi}` },
  ];

  const putarSuara = () => {
    if (speaking) {
      stopBicara();
      setSpeaking(false);
      setSegAktif(null);
      return;
    }
    // pastikan daftar suara termuat
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    setSpeaking(true);
    const ok = narasikan(
      segmenNarasi,
      (id) => setSegAktif(id),
      () => { setSpeaking(false); setSegAktif(null); },
      () => {
        setSpeaking(false);
        setSegAktif(null);
        toast.error("Maaf Bun, perangkat ini belum mendukung suara narator Bahasa Indonesia.");
      }
    );
    if (!ok) {
      setSpeaking(false);
      toast.error("Maaf Bun, perangkat ini belum mendukung suara narator.");
    }
  };

  const kirimWA = () => {
    const pesan =
      `*Panduan Bimbingan PR dari TutorOrangTua AI* 🇮🇩\n\n` +
      `📌 *${soal.judul_singkat}*\n\n` +
      `🎯 *Konsep:* ${soal.konsep_kurikulum}\n\n` +
      `💡 *Analogi:* ${soal.analogi_dapur}\n\n` +
      `🗣️ *Skrip Bimbingan:*\n` +
      soal.skrip_sokratik.map((k) => `${k.langkah}. ${k.tanya_anak}`).join("\n") +
      `\n\n🚨 *Jika anak rewel:* ${soal.skrip_penjinak_emosi}` +
      `\n\n_Dibuat dengan penuh kasih oleh TutorOrangTua AI_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, "_blank");
  };

  const tanyaSpontan = async () => {
    if (!spontanQ.trim()) return;
    setLoadingSpontan(true);
    setSpontanA("");
    try {
      const res = await mintaSpontan(soal.judul_singkat + " - " + soal.konsep_kurikulum, spontanQ, panggilan);
      setSpontanA(res.jawaban);
    } catch {
      toast.error("Maaf Bun, gagal menghubungi AI. Coba lagi ya.");
    } finally {
      setLoadingSpontan(false);
    }
  };

  return (
    <motion.div
      data-testid="kartu-panduan"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl bg-card border border-border shadow-[0_8px_30px_rgba(15,118,110,0.10)] overflow-hidden"
    >
      <div className="bg-primary px-4 py-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-secondary" />
        <p className="text-primary-foreground font-heading font-bold text-sm">
          Kartu Panduan {panggilan} · {soal.judul_singkat}
        </p>
      </div>

      <div className="p-4 space-y-3">
        <Section icon={Target} judul="Maksud & Konsep Kurikulum Merdeka" tint="bg-primary/5" testid="seksi-konsep" active={segAktif === "konsep"}>
          {soal.konsep_kurikulum}
        </Section>

        <Section icon={Lightbulb} judul="Analogi Benda Dapur & Rumah" tint="bg-secondary/10" testid="seksi-analogi" active={segAktif === "analogi"}>
          {soal.analogi_dapur}
        </Section>

        <Section icon={MessageSquareText} judul="Skrip Bimbingan 3 Langkah Sokratik" tint="bg-muted" testid="seksi-skrip" active={segAktif && segAktif.startsWith("skrip")}>
          <div className="space-y-3">
            {soal.skrip_sokratik.map((k, idx) => (
              <div key={k.langkah} className={`relative pl-8 rounded-lg transition-all duration-300 ${segAktif === `skrip-${idx}` ? "bg-secondary/25 py-2 pr-2 -ml-1 pl-9" : ""}`}>
                <span className="absolute left-0 top-0 grid place-items-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {k.langkah}
                </span>
                <p className="font-medium text-foreground">“{k.tanya_anak}”</p>
                {k.jika_anak_salah && (
                  <p className="text-xs mt-1 text-muted-foreground italic">
                    ↳ Jika Adik bingung/salah: “{k.jika_anak_salah}”
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section icon={HeartHandshake} judul="Taktik Penjinak Emosi & Mogok Belajar" tint="bg-rose-50" testid="seksi-emosi" active={segAktif === "emosi"}>
          {soal.skrip_penjinak_emosi}
        </Section>

        {/* Tanya Spontan */}
        <Section icon={HelpCircle} judul="Anak Bertanya di Luar Skrip?" tint="bg-sky-50" testid="seksi-spontan">
          <p className="text-xs text-muted-foreground mb-2">
            Ketik respon tak terduga si Kecil, AI akan bantu Bunda/Ayah menjawab.
          </p>
          <div className="flex gap-2">
            <Textarea
              data-testid="input-spontan"
              value={spontanQ}
              onChange={(e) => setSpontanQ(e.target.value)}
              placeholder="Contoh: 'Kok martabaknya harus dibagi 8 sih, Bun?'"
              className="min-h-[44px] text-sm resize-none bg-white"
            />
            <Button
              data-testid="btn-tanya-spontan"
              onClick={tanyaSpontan}
              disabled={loadingSpontan}
              className="rounded-xl shrink-0 self-end"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {loadingSpontan && <p className="text-xs mt-2 text-primary animate-pulse">AI sedang meracik jawaban...</p>}
          {spontanA && (
            <div className="mt-2 p-3 rounded-xl bg-white border border-border text-sm">💬 {spontanA}</div>
          )}
        </Section>

        {/* Kunci Jawaban - Child Proof */}
        <div className="rounded-2xl border-2 border-dashed border-primary/30 p-4 bg-primary/5" data-testid="seksi-kunci">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="w-4 h-4 text-primary" />
            <h4 className="font-heading font-bold text-sm">Kunci Jawaban Resmi Orang Tua</h4>
          </div>
          <ChildProofLock>
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-xl bg-white border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Langkah Hitung</p>
                <p className="whitespace-pre-line">{soal.kunci_jawaban_orang_tua?.langkah_matematis}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-80">Jawaban Akhir</p>
                <p className="font-bold">{soal.kunci_jawaban_orang_tua?.jawaban_akhir}</p>
              </div>
            </div>
          </ChildProofLock>
        </div>

        {/* Bilah Aksi */}
        <div className="no-print grid grid-cols-2 gap-2 pt-2">
          <Button data-testid="btn-wa" onClick={kirimWA} variant="outline" className="rounded-xl justify-start gap-2 border-primary/30">
            <Share2 className="w-4 h-4 text-primary" /> Kirim ke WhatsApp
          </Button>
          <Button data-testid="btn-tts" onClick={putarSuara} variant="outline" className={`rounded-xl justify-start gap-2 border-primary/30 ${speaking ? "bg-secondary/20 border-secondary" : ""}`}>
            {speaking ? <Square className="w-4 h-4 text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
            {speaking ? "Hentikan Narator" : "Putar Suara Narator"}
          </Button>
          <Button data-testid="btn-print" onClick={() => window.print()} variant="outline" className="rounded-xl justify-start gap-2 border-primary/30">
            <Printer className="w-4 h-4 text-primary" /> Cetak / Simpan PDF
          </Button>
          <Button data-testid="btn-upvote-card" onClick={onUpvote} className="rounded-xl justify-start gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Heart className="w-4 h-4" /> Suka Panduan Ini
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
