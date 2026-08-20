import { useState, useEffect } from "react";
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
import { SHOWCASE_URL } from "./HeaderMenu";
import { toast } from "sonner";
import confetti from "canvas-confetti";

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

  useEffect(() => {
    return () => {
      stopBicara();
    };
  }, []);

  if (!soal) return null;

  const skripList = Array.isArray(soal.skrip_sokratik) ? soal.skrip_sokratik : [];

  const segmenNarasi = [
    { id: "konsep", teks: `Halo ${panggilan}. Yuk kita pahami dulu konsepnya. ${soal.konsep_kurikulum || ""}` },
    { id: "analogi", teks: `Sekarang, mari pakai analogi sederhana. ${soal.analogi_dapur || ""}` },
    ...skripList.map((k, idx) => ({
      id: `skrip-${idx}`,
      teks: `Langkah ke ${k.langkah || idx + 1}. Coba tanyakan pada si Kecil: ${k.tanya_anak || ""}`,
    })),
    { id: "emosi", teks: `Jika si Kecil mulai rewel atau malas, tenangkan dengan lembut. ${soal.skrip_penjinak_emosi || ""}` },
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
    const gender = panggilan === "Ayah" ? "male" : "female";
    const ok = narasikan(
      segmenNarasi,
      (id) => setSegAktif(id),
      () => { setSpeaking(false); setSegAktif(null); },
      () => {
        setSpeaking(false);
        setSegAktif(null);
        toast.error(`Maaf ${panggilan}, perangkat ini belum mendukung suara narator Bahasa Indonesia.`);
      },
      gender
    );
    if (!ok) {
      setSpeaking(false);
      toast.error(`Maaf ${panggilan}, perangkat ini belum mendukung suara narator.`);
    }
  };

  // Sanitasi teks agar pesan WhatsApp tidak rusak oleh simbol / HTML entities
  const bersihkanUntukWA = (teks) => {
    if (!teks) return "";
    return teks
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\*+/g, '') // Bersihkan tanda asterisk ganda bawaan AI agar formatting WA rapi
      .trim();
  };

  const kirimWA = () => {
    const judul = bersihkanUntukWA(soal.judul_singkat || "Panduan Bimbingan PR");
    const konsep = bersihkanUntukWA(soal.konsep_kurikulum);
    const analogi = bersihkanUntukWA(soal.analogi_dapur);
    const emosi = bersihkanUntukWA(soal.skrip_penjinak_emosi);

    let skripText = "";
    skripList.forEach((k, idx) => {
      const langkahNo = k.langkah || idx + 1;
      const tanya = bersihkanUntukWA(k.tanya_anak);
      const jikaSalah = bersihkanUntukWA(k.jika_anak_salah);
      skripText += `${langkahNo}. "${tanya}"\n`;
      if (jikaSalah) {
        skripText += `   ↳ _Jika ragu/salah:_ "${jikaSalah}"\n`;
      }
    });

    const pesan =
      `*PANDUAN BIMBINGAN PR — TUTORORANGTUA AI* 🇮🇩\n\n` +
      `📌 *Topik:* ${judul}\n\n` +
      `🎯 *Maksud & Konsep:*\n${konsep}\n\n` +
      `💡 *Analogi Benda Rumah Tangga:*\n"${analogi}"\n\n` +
      `🗣️ *Langkah Pancingan Berpikir (Sokratik):*\n${skripText}\n` +
      (emosi ? `🚨 *Taktik Saat Anak Lelah / Rewel:*\n${emosi}\n\n` : "") +
      `🔒 _100% Anti-Contekan · Belajar Sambil Menyayangi_\n` +
      `👉 Dibuat via TutorOrangTua AI`;

    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, "_blank");
  };

  // Bungkus teks canvas dengan batas baris aman agar tidak meluap
  const bungkusTeks = (ctx, teks, x, y, maxW, lineH, maxBaris = 12) => {
    if (!teks) return y;
    const kata = teks.split(" ");
    let baris = "";
    let yy = y;
    let jumlahBaris = 0;

    for (let n = 0; n < kata.length; n++) {
      const tes = baris + kata[n] + " ";
      if (ctx.measureText(tes).width > maxW && n > 0) {
        jumlahBaris++;
        if (jumlahBaris >= maxBaris) {
          ctx.fillText(baris.trim() + "...", x, yy);
          return yy + lineH;
        }
        ctx.fillText(baris.trim(), x, yy);
        baris = kata[n] + " ";
        yy += lineH;
      } else {
        baris = tes;
      }
    }
    ctx.fillText(baris.trim(), x, yy);
    return yy + lineH;
  };

  // Buat gambar kutipan adaptif untuk Status WhatsApp (1080 x 1920 HD)
  const buatKutipan = async () => {
    setMembuatKutipan(true);
    try {
      const W = 1080, H = 1920;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");

      // 1. Latar Zamrud Premium
      ctx.fillStyle = "#0F766E";
      ctx.fillRect(0, 0, W, H);

      // Ornamen Latar Belakang
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.beginPath(); ctx.arc(W - 40, 160, 240, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255, 251, 235, 0.08)";
      ctx.beginPath(); ctx.arc(100, H - 180, 280, 0, Math.PI * 2); ctx.fill();

      // 2. Header Brand
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFFBEB";
      ctx.font = "bold 48px Manrope, sans-serif";
      ctx.fillText("👨‍👩‍👧‍👦 TutorOrangTua AI 🇮🇩", W / 2, 170);
      ctx.fillStyle = "#F59E0B";
      ctx.font = "600 30px 'DM Sans', sans-serif";
      ctx.fillText("Bimbing PR Santun & Menyenangkan", W / 2, 230);

      // 3. Kartu Putih Krem Adaptif (Ukuran Besar & Aman)
      const cardX = 75, cardY = 300, cardW = W - 150, cardH = 1380, r = 44;
      ctx.fillStyle = "#FFFBEB";
      ctx.beginPath();
      ctx.moveTo(cardX + r, cardY);
      ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, r);
      ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, r);
      ctx.arcTo(cardX, cardY + cardH, cardX, cardY, r);
      ctx.arcTo(cardX, cardY, cardX + cardW, cardY, r);
      ctx.closePath();
      ctx.fill();

      // 4. Emoji + Judul
      ctx.textAlign = "center";
      ctx.font = "90px sans-serif";
      ctx.fillText(soal.judul_emoji || "💡", W / 2, cardY + 120);

      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 46px Manrope, sans-serif";
      const judulBersih = bersihkanUntukWA(soal.judul_singkat || "Panduan Bimbingan PR");
      let yy = bungkusTeks(ctx, judulBersih, W / 2, cardY + 200, cardW - 140, 56, 2);

      // 5. Label Analogi
      ctx.fillStyle = "#D97706";
      ctx.font = "bold 26px 'DM Sans', sans-serif";
      ctx.fillText("💡 ANALOGI HANGAT DI RUMAH", W / 2, yy + 35);

      // 6. Isi Analogi (Font Adaptif Berdasarkan Panjang Kalimat)
      const analogiBersih = bersihkanUntukWA(soal.analogi_dapur);
      const isLongText = analogiBersih.length > 200;
      ctx.fillStyle = "#134E4A";
      ctx.font = isLongText ? "31px 'DM Sans', sans-serif" : "36px 'DM Sans', sans-serif";
      const lineH = isLongText ? 44 : 50;
      yy = bungkusTeks(ctx, `"${analogiBersih}"`, W / 2, yy + 85, cardW - 120, lineH, isLongText ? 9 : 7);

      // 7. Garis Pemisah Halus
      ctx.strokeStyle = "rgba(15, 118, 110, 0.18)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cardX + 80, yy + 25);
      ctx.lineTo(cardX + cardW - 80, yy + 25);
      ctx.stroke();

      // 8. Ajakan Sokratik
      ctx.fillStyle = "#0F766E";
      ctx.font = "italic 30px 'DM Sans', sans-serif";
      const langkah1 = bersihkanUntukWA(skripList[0]?.tanya_anak || "");
      if (langkah1) {
        bungkusTeks(ctx, `🗣️ Pancingan: "${langkah1}"`, W / 2, yy + 75, cardW - 120, 44, 3);
      }

      // 9. Footer di Luar Kartu (Posisi Terkunci Aman di Bagian Bawah Layar)
      ctx.fillStyle = "#FFFBEB";
      ctx.font = "600 30px 'DM Sans', sans-serif";
      ctx.fillText("🔒 100% Anti-Contekan · Belajar Sambil Menyayangi", W / 2, 1780);
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 28px 'DM Sans', sans-serif";
      ctx.fillText("Buat panduanmu di TutorOrangTua AI", W / 2, 1835);

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
            {(soal.skrip_sokratik || []).map((k, idx) => (
              <div key={k.langkah || idx} className={`relative pl-8 rounded-lg transition-all duration-300 ${segAktif === `skrip-${idx}` ? "bg-secondary/25 py-2 pr-2 -ml-1 pl-9" : ""}`}>
                <span className="absolute left-0 top-0 grid place-items-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {k.langkah || idx + 1}
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
          <Button
            data-testid="btn-upvote-card"
            onClick={() => {
              confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 }, colors: ["#0F766E", "#F59E0B", "#FFFBEB"] });
              window.open(SHOWCASE_URL, "_blank");
              onUpvote && onUpvote();
            }}
            className="col-span-2 rounded-xl justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Heart className="w-4 h-4 fill-current" /> Suka Panduan Ini? Beri Upvote Resmi di Emergent 🚀
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
