import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  Menu, Calculator, Briefcase, Drama, History, Play,
  Heart, TrendingUp, School, Users, X, Trophy,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RaporModal } from "./RaporModal";

const rupiah = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

export const HeaderMenu = ({ onDemo, riwayat, onBukaRiwayat }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [modal, setModal] = useState(null); // 'kalkulator' | 'bisnis' | 'simulasi' | 'riwayat' | 'rapor'
  const [biayaLes, setBiayaLes] = useState(500000);
  const [upvotes, setUpvotes] = useState(1284);

  useEffect(() => {
    setUpvotes(Number(localStorage.getItem("lomba_upvotes") || 1284));
  }, []);

  const beriUpvote = () => {
    const baru = upvotes + 1;
    setUpvotes(baru);
    localStorage.setItem("lomba_upvotes", String(baru));
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.3 }, colors: ["#0F766E", "#F59E0B", "#FFFBEB"] });
    toast.success("Terima kasih atas dukungannya untuk inovasi keluarga Indonesia! ❤️");
  };

  const hitungHemat = () => {
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors: ["#0F766E", "#F59E0B"] });
  };

  const bukaModal = (m) => { setOpenMenu(false); setModal(m); };
  const hematSetahun = biayaLes * 12;
  const jamStres = Math.round((biayaLes / 500000) * 96);

  const menuItems = [
    { key: "demo", icon: Play, label: "🎬 Demo Otomatis 60 Detik", warna: "text-secondary", aksi: () => { setOpenMenu(false); onDemo(); } },
    { key: "kalkulator", icon: Calculator, label: "📊 Kalkulator Penghematan Biaya Les", aksi: () => bukaModal("kalkulator") },
    { key: "rapor", icon: Trophy, label: "🏅 Rapor Perkembangan Anak", warna: "text-primary", aksi: () => bukaModal("rapor") },
    { key: "bisnis", icon: Briefcase, label: "💼 Rencana Bisnis & Skalabilitas", aksi: () => bukaModal("bisnis") },
    { key: "simulasi", icon: Drama, label: "🎭 Simulasi: Marah Dulu vs Sabar Sekarang", aksi: () => bukaModal("simulasi") },
    { key: "riwayat", icon: History, label: "🕒 Riwayat Bimbingan Terakhir", aksi: () => bukaModal("riwayat") },
  ];

  return (
    <>
      {/* Banner Melayang Dukungan Lomba */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 flex items-center gap-2 px-2">
        <Marquee gradient={false} speed={40} className="overflow-hidden">
          <span className="mx-4">🏆 Kontestan Emergent Building Indonesia 2026! Dukung Inovasi Pendidikan Keluarga</span>
          <span className="mx-4">👨‍👩‍👧‍👦 TutorOrangTua AI — Co-Pilot Bimbing PR & Parenting Kurikulum Merdeka</span>
        </Marquee>
        <button
          data-testid="btn-upvote-banner"
          onClick={beriUpvote}
          className="shrink-0 flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 font-bold hover:-translate-y-0.5 active:scale-95 transition-transform duration-200"
        >
          <Heart className="w-3 h-3 fill-current" /> Upvote ({upvotes})
        </button>
      </div>

      {/* Header Utama */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/85 border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-heading font-extrabold text-lg tracking-tight text-primary flex items-center gap-1 truncate">
              👨‍👩‍👧‍👦 TutorOrangTua AI 🇮🇩
            </h1>
            <p className="text-[11px] text-muted-foreground truncate">Co-Pilot Bimbing PR & Parenting Kurikulum Merdeka</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              data-testid="btn-demo-header"
              onClick={onDemo}
              size="sm"
              className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-1 hidden xs:flex sm:flex hover:-translate-y-0.5 active:scale-95 transition-transform duration-200"
            >
              <Play className="w-3.5 h-3.5" /> Demo 60 Detik
            </Button>
            <Sheet open={openMenu} onOpenChange={setOpenMenu}>
              <SheetTrigger asChild>
                <Button data-testid="btn-menu" size="icon" variant="outline" className="rounded-full border-primary/30">
                  <Menu className="w-5 h-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" aria-describedby={undefined} className="w-[85%] max-w-sm bg-background overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-heading text-primary text-left">Menu Utilitas</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-1.5">
                  {menuItems.map((it) => (
                    <button
                      key={it.key}
                      data-testid={`menu-${it.key}`}
                      onClick={it.aksi}
                      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-muted flex items-center gap-3 transition-colors ${it.warna || "text-foreground"}`}
                    >
                      <it.icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{it.label}</span>
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {/* Label Keunggulan */}
        <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {["⚡ Bertenaga Google Gemini AI", "📘 Kurikulum Merdeka SD-SMP", "🔒 100% Anti-Contekan"].map((l) => (
            <span key={l} className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-muted text-primary border border-border">{l}</span>
          ))}
        </div>
      </header>

      {/* ===== MODAL: Kalkulator Penghematan ===== */}
      <Dialog open={modal === "kalkulator"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /> Kalkulator Penghematan Biaya Les</DialogTitle>
            <DialogDescription>Hitung berapa banyak biaya dan stres yang bisa Bunda hemat.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Biaya les anak per bulan</Label>
              <Input
                data-testid="input-biaya-les"
                type="number"
                value={biayaLes}
                onChange={(e) => setBiayaLes(Number(e.target.value))}
                className="mt-1 rounded-xl"
              />
            </div>
            <Button data-testid="btn-hitung-hemat" onClick={hitungHemat} className="w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Hitung Penghematan Saya
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-4 rounded-2xl bg-primary text-primary-foreground text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                <p className="text-[11px] opacity-80">Hemat per tahun</p>
                <p data-testid="hasil-hemat" className="font-heading font-extrabold text-lg leading-tight">{rupiah(hematSetahun)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/15 text-center">
                <Heart className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <p className="text-[11px] text-muted-foreground">Jam stres berkurang/tahun</p>
                <p className="font-heading font-extrabold text-lg leading-tight text-primary">± {jamStres} jam</p>
              </div>
            </div>
            <p className="text-[11px] text-center text-muted-foreground">Cukup jadikan waktu belajar bersama momen hangat keluarga. 💚</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== MODAL: Rencana Bisnis ===== */}
      <Dialog open={modal === "bisnis"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md rounded-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Rencana Bisnis & Skalabilitas</DialogTitle>
            <DialogDescription>Strategi monetisasi B2C keluarga & kemitraan sekolah.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-primary/5">
              <p className="font-bold flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-primary" /> Model B2C (Keluarga)</p>
              <p className="text-foreground/80">Gratis untuk fitur dasar, langganan “Keluarga Pintar” Rp29.000/bln: bimbingan foto tak terbatas, suara premium, & rapor perkembangan anak.</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/10">
              <p className="font-bold flex items-center gap-2 mb-1"><School className="w-4 h-4 text-secondary" /> Kemitraan Sekolah (B2B)</p>
              <p className="text-foreground/80">Lisensi untuk sekolah & bimbel: dashboard guru, distribusi ke ratusan orang tua, sesuai Kurikulum Merdeka Kemendikbud.</p>
            </div>
            <div className="p-3 rounded-xl bg-muted">
              <p className="font-bold flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-primary" /> Skalabilitas</p>
              <p className="text-foreground/80">Optimasi free-tier Gemini Flash + Mode Cadangan menekan biaya. Konten kurikulum bertambah otomatis seiring komunitas orang tua tumbuh.</p>
            </div>
            <div className="p-3 rounded-xl bg-primary text-primary-foreground text-center">
              <p className="text-xs opacity-80">Potensi pasar</p>
              <p className="font-heading font-extrabold text-lg">50 Juta+ Keluarga Indonesia</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== MODAL: Simulasi Marah vs Sabar ===== */}
      <Dialog open={modal === "simulasi"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md rounded-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><Drama className="w-5 h-5 text-primary" /> Cara Marah Dulu vs Cara Sabar Sekarang</DialogTitle>
            <DialogDescription>Perbandingan pendekatan lama vs pendampingan yang sabar.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <p className="font-bold text-rose-700 mb-2 flex items-center gap-1"><X className="w-4 h-4" /> Cara Lama (Marah)</p>
              <ul className="space-y-1.5 text-rose-800/80 list-disc pl-4">
                <li>“Gini aja kok nggak bisa sih?!”</li>
                <li>“Sudah dijelaskan berkali-kali masih salah!”</li>
                <li>Anak menangis, takut, & benci belajar.</li>
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <p className="font-bold text-primary mb-2 flex items-center gap-1"><Heart className="w-4 h-4" /> Cara Baru (Sabar)</p>
              <ul className="space-y-1.5 text-primary/90 list-disc pl-4">
                <li>“Yuk kita bayangkan pakai martabak, pasti seru!”</li>
                <li>“Nggak apa-apa salah, itu tandanya kita lagi belajar.”</li>
                <li>Anak percaya diri, dekat dengan Bunda, & suka belajar.</li>
              </ul>
            </div>
            <p className="text-[11px] text-center text-muted-foreground">TutorOrangTua AI membantu Bunda/Ayah selalu memilih cara sabar. 💚</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== MODAL: Rapor Perkembangan Anak ===== */}
      <RaporModal open={modal === "rapor"} onOpenChange={(o) => !o && setModal(null)} riwayat={riwayat} />

      {/* ===== MODAL: Riwayat ===== */}
      <Dialog open={modal === "riwayat"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md rounded-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2"><History className="w-5 h-5 text-primary" /> Riwayat Bimbingan Terakhir</DialogTitle>
            <DialogDescription>Daftar bimbingan yang tersimpan di memori HP Bunda.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {(!riwayat || riwayat.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-6">Belum ada riwayat, Bun. Yuk mulai bimbing PR pertama! 📸</p>
            )}
            {riwayat && riwayat.map((r, i) => (
              <button
                key={i}
                data-testid={`riwayat-item-${i}`}
                onClick={() => { onBukaRiwayat(r); setModal(null); }}
                className="w-full text-left p-3 rounded-xl bg-muted hover:bg-primary/10 transition-colors"
              >
                <p className="font-medium text-sm truncate">{r.judul}</p>
                <p className="text-[11px] text-muted-foreground">{r.waktu}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
