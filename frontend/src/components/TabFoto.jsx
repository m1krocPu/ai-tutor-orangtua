import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, ImageIcon, PenLine, RotateCw, X, Sparkles, ScanLine, Brain, ChefHat,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { BundaAyahCard } from "./BundaAyahCard";
import { compressImageFile, urlToCompressedDataURL, mintaBimbingan } from "../lib/api";
import { toast } from "sonner";

const GALERI_CONTOH = [
  { url: "https://static.prod-images.emergentagent.com/jobs/5e1bafcb-42d0-4ec4-9f68-beb032d4eb6a/images/0bed766406abf62fd345983064c01bd831a17f8df11866c6422c3a68692eb20d.jpeg", label: "🥞 Pecahan Martabak (Kelas 4 SD)", mapel: "Matematika", jenjang: "Kelas 4 SD" },
  { url: "https://static.prod-images.emergentagent.com/jobs/5e1bafcb-42d0-4ec4-9f68-beb032d4eb6a/images/229b1c2cfe82e998644e6767242b2770818ff539f9f2cd90d306cab56949d6e2.jpeg", label: "💡 KPK Lampu Hias (Kelas 5 SD)", mapel: "Matematika", jenjang: "Kelas 5 SD" },
  { url: "https://static.prod-images.emergentagent.com/jobs/5e1bafcb-42d0-4ec4-9f68-beb032d4eb6a/images/8297bf54ac85efbc8d27528960ea62956c04ef75958cc39c080f39ddab746ee6.jpeg", label: "🌾 Rantai Makanan Sawah (Kelas 5 SD)", mapel: "IPAS", jenjang: "Kelas 5 SD" },
  { url: "https://static.prod-images.emergentagent.com/jobs/5e1bafcb-42d0-4ec4-9f68-beb032d4eb6a/images/02aae7fc0bcad35cdf0a64b3f899f8d7a77cedf524a56fe2d28ec6ce3e9dcf3d.jpeg", label: "🏞️ Bangun Ruang Kolam Taman (Kelas 6 SD)", mapel: "Matematika", jenjang: "Kelas 6 SD" },
  { url: "https://static.prod-images.emergentagent.com/jobs/5e1bafcb-42d0-4ec4-9f68-beb032d4eb6a/images/205378e26731d3a3fd9767af3a493300e39ba828bc5d3e227547313d20ec125d.jpeg", label: "🏬 Diskon Bertingkat Mall (Kelas 7 SMP)", mapel: "Matematika", jenjang: "Kelas 7 SMP" },
  { url: "https://static.prod-images.emergentagent.com/jobs/5e1bafcb-42d0-4ec4-9f68-beb032d4eb6a/images/12144016454234100d80ecf8d2193b22130ff5e6d98817b02797458c8f0294bf.jpeg", label: "🕐 Jam Dinding Analog (Kelas 2 SD)", mapel: "Matematika", jenjang: "Kelas 2 SD" },
];

const MAPEL = [
  { v: "Matematika", l: "🔢 Matematika" },
  { v: "IPAS", l: "🔬 IPAS / Sains" },
  { v: "Bahasa", l: "🧩 Bahasa / Logika" },
];
const JENJANG = ["Kelas 1 SD", "Kelas 2 SD", "Kelas 3 SD", "Kelas 4 SD", "Kelas 5 SD", "Kelas 6 SD", "Kelas 7 SMP", "Kelas 8 SMP", "Kelas 9 SMP"];
const GAYA = [
  { v: "Kinestetik", l: "🖐️ Kinestetik" },
  { v: "Visual", l: "👁️ Visual" },
  { v: "Auditori", l: "👂 Auditori" },
];
const MOOD = [
  { v: "Semangat", l: "🟢 Semangat", c: "data-[on=true]:bg-emerald-500 data-[on=true]:text-white" },
  { v: "Malas / Ngantuk", l: "🥱 Malas", c: "data-[on=true]:bg-amber-400 data-[on=true]:text-amber-950" },
  { v: "Mogok / Menangis", l: "😭 Mogok", c: "data-[on=true]:bg-rose-500 data-[on=true]:text-white" },
];
const PROSES = [
  { icon: ScanLine, teks: "Membaca Foto Soal..." },
  { icon: Brain, teks: "Memetakan Nalar Kurikulum..." },
  { icon: ChefHat, teks: "Meracik Analogi Dapur..." },
];

const Pilih = ({ items, value, onChange, testid }) => (
  <div data-testid={testid} className="flex flex-wrap gap-1.5">
    {items.map((it) => {
      const val = it.v || it;
      const lab = it.l || it;
      const on = value === val;
      return (
        <button
          key={val}
          data-on={on}
          onClick={() => onChange(val)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-transform duration-200 active:scale-95 ${
            on ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border hover:-translate-y-0.5"
          } ${it.c || ""}`}
        >
          {lab}
        </button>
      );
    })}
  </div>
);

export const TabFoto = ({ onSimpanRiwayat, initialHasil, panggilanDefault = "Bunda" }) => {
  const [foto, setFoto] = useState(null);
  const [rotasi, setRotasi] = useState(0);
  const [teksManual, setTeksManual] = useState("");
  const [mapel, setMapel] = useState("Matematika");
  const [jenjang, setJenjang] = useState("Kelas 4 SD");
  const [panggilan, setPanggilan] = useState(panggilanDefault);
  const [gaya, setGaya] = useState("Visual");
  const [mood, setMood] = useState("Semangat");
  const [loading, setLoading] = useState(false);
  const [prosesStep, setProsesStep] = useState(0);
  const [hasil, setHasil] = useState(null);
  const [aktifSoal, setAktifSoal] = useState(0);
  const camRef = useRef(null);
  const galRef = useRef(null);

  useEffect(() => {
    if (initialHasil) {
      setHasil(initialHasil.data);
      setPanggilan(initialHasil.panggilan || panggilanDefault);
      setAktifSoal(0);
    }
  }, [initialHasil]);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setProsesStep((p) => (p + 1) % PROSES.length), 1400);
    return () => clearInterval(t);
  }, [loading]);

  const pilihFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setFoto(dataUrl);
      setRotasi(0);
      toast.success("Foto siap, Bun! ✅");
    } catch {
      toast.error("Gagal memuat foto. Coba lagi ya.");
    }
    e.target.value = "";
  };

  const pilihContoh = async (item) => {
    setMapel(item.mapel);
    setJenjang(item.jenjang);
    toast.info("Memuat foto contoh...");
    try {
      const dataUrl = await urlToCompressedDataURL(item.url);
      setFoto(dataUrl);
      setRotasi(0);
      setTeksManual("");
    } catch {
      setFoto(item.url);
      setTeksManual(item.label.replace(/^[^\s]+\s/, ""));
      toast.info("Foto contoh dimuat.");
    }
  };

  const submit = async () => {
    if (!foto && !teksManual.trim()) {
      toast.error("Unggah foto atau ketik soal dulu ya, Bun.");
      return;
    }
    setLoading(true);
    setProsesStep(0);
    setHasil(null);
    try {
      const payload = {
        mode: foto ? "foto" : "teks",
        image_base64: foto || null,
        teks_soal: teksManual || null,
        mata_pelajaran: mapel,
        jenjang,
        panggilan,
        gaya_belajar: gaya,
        suasana_hati: mood,
      };
      const data = await mintaBimbingan(payload);
      if (data.is_school_question === false) {
        toast.error(data.non_school_message || "Sepertinya ini bukan soal sekolah, Bun.");
        setLoading(false);
        return;
      }
      setHasil(data);
      setAktifSoal(0);
      if (data.sumber === "offline") toast.info("Mode Cadangan aktif — panduan contoh ditampilkan.");
      const judul = data.daftar_soal?.[0]?.judul_singkat || "Bimbingan PR";
      onSimpanRiwayat && onSimpanRiwayat({ judul, waktu: new Date().toLocaleString("id-ID"), ts: Date.now(), mapel, jenjang, data, panggilan });
    } catch (e) {
      toast.error("Maaf Bun, gagal menyusun panduan. Coba lagi ya.");
    } finally {
      setLoading(false);
    }
  };

  const daftarSoal = hasil?.daftar_soal || [];

  return (
    <div className="space-y-4">
      {/* Blok unggah */}
      <div className="rounded-3xl bg-card border border-border p-4 shadow-[0_8px_30px_rgba(15,118,110,0.06)]">
        <h2 className="font-heading font-bold text-base mb-1">📸 Foto & Bimbing PR Bebas</h2>
        <p className="text-xs text-muted-foreground mb-3">Ambil foto soal PR si Kecil, AI Gemini bantu susun cara membimbingnya.</p>

        {!foto ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              data-testid="btn-kamera"
              onClick={() => camRef.current?.click()}
              className="col-span-2 rounded-2xl bg-primary text-primary-foreground p-5 flex flex-col items-center gap-1.5 hover:-translate-y-0.5 active:scale-95 transition-transform duration-200"
            >
              <Camera className="w-8 h-8" />
              <span className="font-heading font-bold">📸 Buka Kamera HP</span>
            </button>
            <button
              data-testid="btn-galeri"
              onClick={() => galRef.current?.click()}
              className="rounded-2xl bg-secondary/15 border border-secondary/30 p-4 flex flex-col items-center gap-1.5 hover:-translate-y-0.5 active:scale-95 transition-transform duration-200"
            >
              <ImageIcon className="w-6 h-6 text-secondary" />
              <span className="text-xs font-semibold">🖼️ Buka Galeri HP</span>
            </button>
            <button
              data-testid="btn-manual"
              onClick={() => document.getElementById("teks-manual")?.focus()}
              className="rounded-2xl bg-muted p-4 flex flex-col items-center gap-1.5 hover:-translate-y-0.5 active:scale-95 transition-transform duration-200"
            >
              <PenLine className="w-6 h-6 text-primary" />
              <span className="text-xs font-semibold">✍️ Ketik Soal Manual</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-muted grid place-items-center" style={{ minHeight: 160 }}>
              <img src={foto} alt="Pratinjau soal" style={{ transform: `rotate(${rotasi}deg)` }} className="max-h-56 object-contain transition-transform duration-300" />
            </div>
            <div className="flex gap-2">
              <Button data-testid="btn-putar" onClick={() => setRotasi((r) => (r + 90) % 360)} variant="outline" size="sm" className="rounded-xl gap-1 border-primary/30">
                <RotateCw className="w-4 h-4" /> Putar 90°
              </Button>
              <Button data-testid="btn-hapus-foto" onClick={() => { setFoto(null); setRotasi(0); }} variant="outline" size="sm" className="rounded-xl gap-1 border-rose-300 text-rose-600">
                <X className="w-4 h-4" /> Hapus Foto
              </Button>
            </div>
          </div>
        )}

        <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={pilihFile} className="hidden" data-testid="input-kamera" />
        <input ref={galRef} type="file" accept="image/*" onChange={pilihFile} className="hidden" data-testid="input-galeri" />

        {/* Kotak koreksi teks */}
        <div className="mt-3">
          <label className="text-xs font-semibold text-muted-foreground">✏️ Koreksi / ketik soal manual (jika foto kurang jelas)</label>
          <Textarea
            id="teks-manual"
            data-testid="teks-manual"
            value={teksManual}
            onChange={(e) => setTeksManual(e.target.value)}
            placeholder="Contoh: Ibu punya 1 martabak dipotong 8, Kakak makan 3 potong. Berapa sisanya?"
            className="mt-1 rounded-xl bg-white min-h-[70px]"
          />
        </div>
      </div>

      {/* Galeri Contoh */}
      <div className="rounded-3xl bg-card border border-border p-4">
        <h3 className="font-heading font-bold text-sm mb-0.5">🖼️ Galeri 6 Foto Soal PR Asli Siap Uji</h3>
        <p className="text-[11px] text-muted-foreground mb-3">Khusus juri yang menguji lewat laptop tanpa buku fisik — klik untuk langsung mencoba.</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x">
          {GALERI_CONTOH.map((g, i) => (
            <button
              key={i}
              data-testid={`galeri-contoh-${i}`}
              onClick={() => pilihContoh(g)}
              className="shrink-0 w-32 snap-start rounded-2xl overflow-hidden border border-border bg-muted hover:-translate-y-1 active:scale-95 transition-transform duration-200"
            >
              <img src={g.url} alt={g.label} className="w-full h-24 object-cover" />
              <p className="text-[10px] font-semibold p-1.5 text-left leading-tight">{g.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Parameter */}
      <div className="rounded-3xl bg-card border border-border p-4 space-y-3">
        <h3 className="font-heading font-bold text-sm">⚙️ Parameter Bimbingan</h3>
        <div><p className="text-xs font-semibold text-muted-foreground mb-1.5">Mata Pelajaran</p><Pilih testid="pilih-mapel" items={MAPEL} value={mapel} onChange={setMapel} /></div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">Jenjang Kelas</p>
          <select data-testid="pilih-jenjang" value={jenjang} onChange={(e) => setJenjang(e.target.value)} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm">
            {JENJANG.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        <div><p className="text-xs font-semibold text-muted-foreground mb-1.5">Panggilan Orang Tua</p><Pilih testid="pilih-panggilan" items={["Bunda", "Ayah"]} value={panggilan} onChange={setPanggilan} /></div>
        <div><p className="text-xs font-semibold text-muted-foreground mb-1.5">Gaya Belajar Anak</p><Pilih testid="pilih-gaya" items={GAYA} value={gaya} onChange={setGaya} /></div>
        <div><p className="text-xs font-semibold text-muted-foreground mb-1.5">Suasana Hati Anak</p><Pilih testid="pilih-mood" items={MOOD} value={mood} onChange={setMood} /></div>
      </div>

      {/* Tombol Utama */}
      <Button
        data-testid="btn-susun-panduan"
        onClick={submit}
        disabled={loading}
        className="w-full rounded-2xl h-14 text-base font-heading font-bold gap-2 shadow-[0_8px_30px_rgba(15,118,110,0.25)] hover:-translate-y-0.5 active:scale-95 transition-transform duration-200"
      >
        {loading ? (
          <AnimatePresence mode="wait">
            <motion.span key={prosesStep} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
              {(() => { const I = PROSES[prosesStep].icon; return <I className="w-5 h-5 animate-pulse" />; })()}
              {PROSES[prosesStep].teks}
            </motion.span>
          </AnimatePresence>
        ) : (
          <><Sparkles className="w-5 h-5" /> ✨ Susun Panduan Bicara {panggilan}</>
        )}
      </Button>

      {/* Hasil */}
      {daftarSoal.length > 0 && (
        <div className="space-y-3 pt-1" data-testid="hasil-bimbingan">
          {daftarSoal.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {daftarSoal.map((_, i) => (
                <button
                  key={i}
                  data-testid={`pilih-soal-${i}`}
                  onClick={() => setAktifSoal(i)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-transform duration-200 active:scale-95 ${aktifSoal === i ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border"}`}
                >
                  Soal No. {i + 1}
                </button>
              ))}
            </div>
          )}
          <BundaAyahCard soal={daftarSoal[aktifSoal]} panggilan={panggilan} onUpvote={() => toast.success("Terima kasih dukungannya! ❤️")} />
        </div>
      )}
    </div>
  );
};
