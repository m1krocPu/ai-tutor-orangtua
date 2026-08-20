import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, CalendarDays, BookMarked, Star, Sparkles, Trophy } from "lucide-react";

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MAPEL_WARNA = { Matematika: "#0F766E", IPAS: "#F59E0B", Bahasa: "#0EA5E9" };

const LENCANA = [
  { emoji: "🌱", nama: "Pemula", ket: "Sesi pertama", syarat: (s) => s.total >= 1 },
  { emoji: "📚", nama: "Rajin", ket: "5 bimbingan", syarat: (s) => s.total >= 5 },
  { emoji: "🔥", nama: "Konsisten", ket: "3 hari beruntun", syarat: (s) => s.streak >= 3 },
  { emoji: "⭐", nama: "Bintang", ket: "10 bimbingan", syarat: (s) => s.total >= 10 },
  { emoji: "🏆", nama: "Juara", ket: "7 hari beruntun", syarat: (s) => s.streak >= 7 },
  { emoji: "💎", nama: "Legenda", ket: "25 bimbingan", syarat: (s) => s.total >= 25 },
];

const getTs = (r) => r.ts || (r.waktu ? Date.parse(r.waktu) : 0) || 0;

export const RaporModal = ({ open, onOpenChange, riwayat = [] }) => {
  const stat = useMemo(() => {
    const now = new Date();
    const batas = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const mingguIni = riwayat.filter((r) => getTs(r) >= batas);

    // per hari (7 hari terakhir)
    const perHari = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const akhir = d.getTime() + 24 * 60 * 60 * 1000;
      const jumlah = riwayat.filter((r) => getTs(r) >= d.getTime() && getTs(r) < akhir).length;
      perHari.push({ hari: HARI[d.getDay()], jumlah });
    }

    // per mapel (minggu ini, fallback all-time)
    const pakaiSemua = mingguIni.length === 0;
    const sumber = pakaiSemua ? riwayat : mingguIni;
    const perMapel = {};
    sumber.forEach((r) => {
      const m = r.mapel || "Lainnya";
      perMapel[m] = (perMapel[m] || 0) + 1;
    });
    const mapelArr = Object.entries(perMapel).map(([nama, jumlah]) => ({ nama, jumlah })).sort((a, b) => b.jumlah - a.jumlah);

    const topikUnik = [...new Set(mingguIni.map((r) => r.judul))];
    const topMapel = mapelArr[0]?.nama;

    // Rentetan hari (streak)
    const fmt = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const hariSet = new Set(riwayat.filter((r) => getTs(r) > 0).map((r) => fmt(new Date(getTs(r)))));
    let streak = 0;
    const cursor = new Date(now);
    if (!hariSet.has(fmt(cursor))) cursor.setDate(cursor.getDate() - 1); // beri toleransi jika hari ini belum belajar
    while (hariSet.has(fmt(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return {
      total: riwayat.length,
      mingguIni: mingguIni.length,
      perHari,
      mapelArr,
      pakaiSemua,
      topikUnik,
      topMapel,
      streak,
      hariAktif: perHari.filter((h) => h.jumlah > 0).length,
    };
  }, [riwayat]);

  const narasi = () => {
    if (stat.total === 0)
      return "Belum ada bimbingan minggu ini, Bun. Yuk mulai dampingi PR pertama si Kecil — sekecil apa pun langkahnya, itu berharga! 💚";
    if (stat.mingguIni === 0)
      return "Minggu ini belum ada sesi baru, Bun. Tidak apa-apa, yuk luangkan 15 menit hari ini untuk belajar bareng si Kecil ya! 🌱";
    return `Luar biasa, ${riwayat[0]?.panggilan || "Bunda"}! Minggu ini sudah ${stat.mingguIni} kali mendampingi si Kecil belajar${stat.topMapel ? `, paling banyak di ${stat.topMapel}` : ""}. Konsistensi hangat inilah hadiah terbaik untuk masa depan Kakak. Pertahankan ya! 🌟`;
  };

  const maxHari = Math.max(1, ...stat.perHari.map((h) => h.jumlah));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl max-h-[88vh] overflow-y-auto" data-testid="rapor-modal">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" /> Rapor Perkembangan Anak
          </DialogTitle>
          <DialogDescription>Laporan mingguan pendampingan belajar bersama si Kecil.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Kartu narasi */}
          <div className="p-4 rounded-2xl bg-primary text-primary-foreground">
            <p className="text-sm leading-relaxed">{narasi()}</p>
          </div>

          {/* Rentetan Hari (Streak) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 flex items-center gap-3" data-testid="rapor-streak">
            <div className="text-4xl">🔥</div>
            <div className="flex-1">
              <p className="font-heading font-extrabold text-2xl text-primary leading-none">{stat.streak} hari</p>
              <p className="text-xs text-muted-foreground mt-0.5">Rentetan mendampingi beruntun</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground">
                {stat.streak === 0 ? "Ayo mulai hari ini!" : stat.streak < 3 ? "Terus lanjutkan ya!" : "Luar biasa, Bunda! 🌟"}
              </p>
            </div>
          </div>

          {/* Lencana Konsistensi */}
          <div className="p-4 rounded-2xl bg-card border border-border" data-testid="rapor-lencana">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">🏅 Lencana Konsistensi</p>
            <div className="grid grid-cols-3 gap-2">
              {LENCANA.map((b) => {
                const buka = b.syarat(stat);
                return (
                  <div
                    key={b.nama}
                    data-testid={`lencana-${b.nama}`}
                    data-unlocked={buka}
                    className={`rounded-2xl p-2.5 text-center border transition-all ${buka ? "bg-secondary/15 border-secondary/40" : "bg-muted border-border opacity-50 grayscale"}`}
                  >
                    <div className="text-2xl mb-1">{buka ? b.emoji : "🔒"}</div>
                    <p className="text-[11px] font-bold leading-tight">{b.nama}</p>
                    <p className="text-[9px] text-muted-foreground leading-tight">{b.ket}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ringkasan angka */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-card border border-border text-center" data-testid="rapor-minggu-ini">
              <CalendarDays className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="font-heading font-extrabold text-xl text-primary leading-none">{stat.mingguIni}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Sesi minggu ini</p>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border text-center">
              <BookMarked className="w-5 h-5 mx-auto mb-1 text-secondary" />
              <p className="font-heading font-extrabold text-xl text-primary leading-none">{stat.total}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Total bimbingan</p>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="font-heading font-extrabold text-xl text-primary leading-none">{stat.hariAktif}/7</p>
              <p className="text-[10px] text-muted-foreground mt-1">Hari aktif</p>
            </div>
          </div>

          {/* Grafik per hari */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Aktivitas 7 Hari Terakhir</p>
            <div style={{ width: "100%", height: 140 }}>
              <ResponsiveContainer minWidth={0} minHeight={140}>
                <BarChart data={stat.perHari} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                  <XAxis dataKey="hari" tick={{ fontSize: 11, fill: "#0F766E" }} axisLine={false} tickLine={false} />
                  <Bar dataKey="jumlah" radius={[6, 6, 0, 0]} maxBarSize={28}>
                    {stat.perHari.map((h, i) => (
                      <Cell key={i} fill={h.jumlah === maxHari && h.jumlah > 0 ? "#F59E0B" : "#0F766E"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per mata pelajaran */}
          {stat.mapelArr.length > 0 && (
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Fokus Mata Pelajaran{stat.pakaiSemua ? " (Sepanjang Waktu)" : ""}</p>
              <div className="space-y-2">
                {stat.mapelArr.map((m) => {
                  const persen = Math.round((m.jumlah / stat.mapelArr.reduce((a, b) => a + b.jumlah, 0)) * 100);
                  return (
                    <div key={m.nama} data-testid={`rapor-mapel-${m.nama}`}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold">{m.nama}</span>
                        <span className="text-muted-foreground">{m.jumlah}x · {persen}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${persen}%`, backgroundColor: MAPEL_WARNA[m.nama] || "#0F766E" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topik minggu ini */}
          {stat.topikUnik.length > 0 && (
            <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30">
              <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-secondary" /> Topik Dikuasai Minggu Ini
              </p>
              <div className="flex flex-wrap gap-1.5">
                {stat.topikUnik.map((t, i) => (
                  <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-border">{t}</span>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-secondary" /> Data tersimpan aman di memori HP Bunda
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
