import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { mintaCurhat } from "../lib/api";
import { KONSULTASI_CEPAT } from "../data/kurikulum";
import { toast } from "sonner";

export const TabCurhat = () => {
  const [pesan, setPesan] = useState([
    { peran: "ai", teks: "Halo Bunda/Ayah 🤗 Saya pendamping parenting keluarga Indonesia. Ada yang ingin dicurhatkan tentang si Kecil? Ceritakan saja, kita cari solusinya bersama ya." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [pesan, loading]);

  const kirim = async (teks) => {
    const pertanyaan = (teks ?? input).trim();
    if (!pertanyaan || loading) return;
    const riwayat = pesan.map((p) => ({ peran: p.peran === "ai" ? "ai" : "user", teks: p.teks }));
    setPesan((p) => [...p, { peran: "user", teks: pertanyaan }]);
    setInput("");
    setLoading(true);
    try {
      const res = await mintaCurhat(pertanyaan, riwayat);
      setPesan((p) => [...p, { peran: "ai", teks: res.jawaban }]);
    } catch {
      toast.error("Maaf Bun, AI sedang sibuk. Coba lagi ya.");
      setPesan((p) => [...p, { peran: "ai", teks: "Maaf Bun, koneksi sedang bermasalah. Coba beberapa saat lagi ya. 🙏" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 300px)", minHeight: 420 }}>
      <div className="rounded-3xl bg-primary text-primary-foreground p-4 mb-3">
        <h2 className="font-heading font-bold text-base flex items-center gap-2"><HeartHandshake className="w-5 h-5" /> Ruang Curhat & Trik Parenting</h2>
        <p className="text-xs opacity-85 mt-1">Konsultasi bebas dengan AI Psikolog & Konsultan Parenting.</p>
      </div>

      {/* Konsultasi cepat */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-2">
        {KONSULTASI_CEPAT.map((k, i) => (
          <button
            key={i}
            data-testid={`konsultasi-cepat-${i}`}
            onClick={() => kirim(k)}
            disabled={loading}
            className="shrink-0 max-w-[220px] text-left text-[11px] font-medium px-3 py-2 rounded-2xl bg-secondary/15 border border-secondary/30 hover:-translate-y-0.5 active:scale-95 transition-transform duration-200"
          >
            💡 {k}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 rounded-3xl bg-card border border-border p-3" data-testid="chat-area">
        {pesan.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${p.peran === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line ${p.peran === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
              {p.peran === "ai" && <Sparkles className="w-3.5 h-3.5 inline mr-1 text-secondary" />}
              {p.teks}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <Textarea
          data-testid="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); kirim(); } }}
          placeholder="Ceritakan keluh kesah Bunda/Ayah di sini..."
          className="min-h-[48px] max-h-24 resize-none rounded-2xl bg-white"
        />
        <Button data-testid="chat-kirim" onClick={() => kirim()} disabled={loading} size="icon" className="rounded-2xl h-12 w-12 shrink-0 self-end">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
