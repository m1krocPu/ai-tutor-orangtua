import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target, Lightbulb, MessageSquareText, HeartHandshake, KeyRound,
  Volume2, Square, Printer, Share2, Heart, Sparkles, HelpCircle, Send,
  ImageDown, Download, X,
} from "lucide-react";
import { ChildProofLock } from "./ChildProofLock";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
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
  const [kutipanUrl, setKutipanUrl] = useState(null);
  const [membuatKutipan, setMembuatKutipan] = useState(false);

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

  // Buat gambar kutipan cantik untuk Status WhatsApp (canvas)
  const bungkusTeks = (ctx, teks, x, y, maxW, lineH) => {
    const kata = teks.split(" ");
    let baris = "";
    let yy = y;
    for (let n = 0; n < kata.length; n++) {
      const tes = baris + kata[n] + " ";
      if (ctx.measureText(tes).width > maxW && n > 0) {
        ctx.fillText(baris.trim(), x, yy);
        baris = kata[n] + " ";
        yy += lineH;
      } else baris = tes;
    }
    ctx.fillText(baris.trim(), x, yy);
    return yy + lineH;
  };

  const buatKutipan = async () => {
    setMembuatKutipan(true);
    try {
      const W = 1080, H = 1920;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");
      // Latar zamrud
      ctx.fillStyle = "#0F766E"; ctx.fillRect(0, 0, W, H);
      // Ornamen lingkaran
      ctx.fillStyle = "rgba(245,158,11,0.18)";
      ctx.beginPath(); ctx.arc(W - 60, 180, 260, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,251,235,0.10)";
      ctx.beginPath(); ctx.arc(120, H - 160, 300, 0, Math.PI * 2); ctx.fill();
      // Header brand
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFFBEB";
      ctx.font = "bold 52px Manrope, sans-serif";
      ctx.fillText("👨‍👩‍👧‍👦 TutorOrangTua AI 🇮🇩", W / 2, 200);
      ctx.fillStyle = "#F59E0B";
      ctx.font = "600 34px 'DM Sans', sans-serif";
      ctx.fillText("Bimbing PR ala Kurikulum Merdeka", W / 2, 260);
      // Kartu krem
      const cardX = 90, cardY = 360, cardW = W - 180, cardH = 1180, r = 48;
      ctx.fillStyle = "#FFFBEB";
      ctx.beginPath();
      ctx.moveTo(cardX + r, cardY);
      ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, r);
      ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, r);
      ctx.arcTo(cardX, cardY + cardH, cardX, cardY, r);
      ctx.arcTo(cardX, cardY, cardX + cardW, cardY, r);
      ctx.closePath(); ctx.fill();
      // Emoji + Judul
      ctx.textAlign = "center";
      ctx.font = "120px sans-serif";
      ctx.fillText(soal.judul_emoji || "💡", W / 2, cardY + 170);
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 56px Manrope, sans-serif";
      let yy = bungkusTeks(ctx, soal.judul_singkat, W / 2, cardY + 280, cardW - 160, 66);
      // Label analogi
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 30px 'DM Sans', sans-serif";
      ctx.fillText("💡 ANALOGI HANGAT DI RUMAH", W / 2, yy + 40);
      // Isi analogi
      ctx.fillStyle = "#134E4A";
      ctx.font = "40px 'DM Sans', sans-serif";
      yy = bungkusTeks(ctx, `"${soal.analogi_dapur}"`, W / 2, yy + 110, cardW - 140, 56);
      // Garis
      ctx.strokeStyle = "rgba(15,118,110,0.2)"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cardX + 120, yy + 30); ctx.lineTo(cardX + cardW - 120, yy + 30); ctx.stroke();
      // Ajakan sokratik
      ctx.fillStyle = "#0F766E";
      ctx.font = "italic 36px 'DM Sans', sans-serif";
      const langkah1 = soal.skrip_sokratik?.[0]?.tanya_anak || "";
      bungkusTeks(ctx, `🗣️ "${langkah1}"`, W / 2, yy + 100, cardW - 140, 52);
      // Footer
      ctx.fillStyle = "#FFFBEB";
      ctx.font = "600 32px 'DM Sans', sans-serif";
      ctx.fillText("🔒 100% Anti-Contekan · Belajar Sambil Menyayangi", W / 2, cardY + cardH + 90);
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 30px 'DM Sans', sans-serif";
      ctx.fillText("Buat panduanmu sendiri di TutorOrangTua AI", W / 2, cardY + cardH + 145);

      const url = c.toDataURL("image/png");
      setKutipanUrl(url);
    } catch (e) {
      toast.error("Maaf Bun, gagal membuat gambar. Coba lagi ya.");
    } finally {
      setMembuatKutipan(false);
    }
  };

  const unduhKutipan = () => {
    const a = document.createElement("a");
    a.href = kutipanUrl;
    a.download = `Panduan-${soal.judul_singkat.replace(/\s+/g, "-")}.png`;
    a.click();
    toast.success("Gambar tersimpan! Siap diunggah ke Status WA. 📲");
  };

  const bagikanKutipan = async () => {
    try {
      const blob = await (await fetch(kutipanUrl)).blob();
      const file = new File([blob], "panduan.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "TutorOrangTua AI", text: soal.judul_singkat });
      } else {
        unduhKutipan();
        window.open("https://wa.me/", "_blank");
      }
    } catch {
      unduhKutipan();
    }
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

      {soal.img && (
        <img src={soal.img} alt={soal.judul_singkat} loading="lazy" className="w-full h-40 object-cover" />
      )}

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
          <Button data-testid="btn-kutipan" onClick={buatKutipan} disabled={membuatKutipan} variant="outline" className="rounded-xl justify-start gap-2 border-primary/30">
            <ImageDown className="w-4 h-4 text-primary" /> {membuatKutipan ? "Membuat..." : "Gambar Kutipan WA"}
          </Button>
          <Button data-testid="btn-upvote-card" onClick={onUpvote} className="col-span-2 rounded-xl justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Heart className="w-4 h-4" /> Suka Panduan Ini? Beri Upvote Lomba
          </Button>
        </div>
      </div>

      {/* Preview Gambar Kutipan */}
      <Dialog open={!!kutipanUrl} onOpenChange={(o) => !o && setKutipanUrl(null)}>
        <DialogContent className="max-w-sm rounded-3xl" data-testid="kutipan-modal">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><ImageDown className="w-5 h-5 text-primary" /> Gambar Kutipan untuk Status WA</DialogTitle>
            <DialogDescription>Simpan lalu unggah ke Status WhatsApp Bunda ya. 💚</DialogDescription>
          </DialogHeader>
          {kutipanUrl && <img src={kutipanUrl} alt="Kutipan panduan" className="w-full rounded-2xl border border-border" />}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button data-testid="btn-unduh-kutipan" onClick={unduhKutipan} variant="outline" className="rounded-xl gap-2 border-primary/30">
              <Download className="w-4 h-4 text-primary" /> Simpan Gambar
            </Button>
            <Button data-testid="btn-bagikan-kutipan" onClick={bagikanKutipan} className="rounded-xl gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Share2 className="w-4 h-4" /> Bagikan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
