import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { BundaAyahCard } from "./BundaAyahCard";
import { TOPIK_KURIKULUM, FASE_INFO } from "../data/kurikulum";
import { toast } from "sonner";

const toSoal = (t) => ({
  judul_singkat: t.judul,
  img: t.img,
  konsep_kurikulum: t.konsep,
  analogi_dapur: t.analogi,
  skrip_sokratik: t.skrip,
  skrip_penjinak_emosi: t.emosi,
  kunci_jawaban_orang_tua: { langkah_matematis: t.langkah, jawaban_akhir: t.jawaban },
});

export const TabPustaka = ({ onSimpanRiwayat }) => {
  const [terpilih, setTerpilih] = useState(null);
  const fases = ["A", "B", "C", "D"];

  const buka = (t) => {
    const soal = toSoal(t);
    setTerpilih({ soal, judul: t.judul });
    onSimpanRiwayat && onSimpanRiwayat({
      judul: t.judul, waktu: new Date().toLocaleString("id-ID"), ts: Date.now(),
      mapel: t.mapel, jenjang: t.kelas, fase: t.fase,
      data: { daftar_soal: [soal] }, panggilan: "Bunda",
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-primary text-primary-foreground p-4">
        <h2 className="font-heading font-bold text-base">📚 Pustaka 50+ Topik Kurikulum Merdeka</h2>
        <p className="text-xs opacity-85 mt-1">Mega katalog per Fase Pembelajaran Kemendikbud. Klik topik untuk membuka Kartu Panduan secara instan!</p>
      </div>

      <Accordion type="single" collapsible defaultValue="A" className="space-y-3">
        {fases.map((f) => {
          const info = FASE_INFO[f];
          const topik = TOPIK_KURIKULUM.filter((t) => t.fase === f);
          return (
            <AccordionItem key={f} value={f} className="rounded-2xl bg-card border border-border px-4 overflow-hidden">
              <AccordionTrigger data-testid={`fase-${f}`} className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.warna}`}>{info.label}</span>
                  <div>
                    <p className="font-heading font-bold text-sm">{info.ket}</p>
                    <p className="text-[11px] text-muted-foreground">{topik.length} topik tersedia</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid gap-2">
                  {topik.map((t) => (
                    <button
                      key={t.id}
                      data-testid={`topik-${t.id}`}
                      onClick={() => buka(t)}
                      className="w-full text-left p-2.5 rounded-xl bg-muted hover:bg-primary/10 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-primary/10">
                        <img src={t.img} alt={t.judul} loading="lazy" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 text-sm bg-white/85 rounded-tl-md px-0.5 leading-none">{t.emoji}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{t.judul}</p>
                        <p className="text-[11px] text-muted-foreground">{t.kelas} · {t.mapel}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Dialog open={!!terpilih} onOpenChange={(o) => !o && setTerpilih(null)}>
        <DialogContent className="max-w-md rounded-3xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">Kartu Panduan Bunda/Ayah</DialogTitle>
          <DialogDescription className="sr-only">Panduan bimbingan PR untuk topik terpilih.</DialogDescription>
          {terpilih && <BundaAyahCard soal={terpilih.soal} panggilan="Bunda" onUpvote={() => toast.success("Terima kasih! ❤️")} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};
