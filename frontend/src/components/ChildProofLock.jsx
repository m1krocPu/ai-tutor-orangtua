import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Lock, LockOpen, ChevronsRight } from "lucide-react";

// Geser untuk membuka kunci jawaban (child-proof)
export const ChildProofLock = ({ onUnlock, children }) => {
  const [unlocked, setUnlocked] = useState(false);
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [maxX, setMaxX] = useState(240);
  const bg = useTransform(x, [0, maxX], ["hsl(175 30% 92%)", "hsl(175 77% 26%)"]);
  const opacity = useTransform(x, [0, maxX * 0.6], [1, 0]);

  const handleDragEnd = () => {
    if (x.get() > maxX * 0.75) {
      setUnlocked(true);
      onUnlock && onUnlock();
    } else {
      x.set(0);
    }
  };

  if (unlocked) {
    return (
      <div data-testid="kunci-jawaban-terbuka" className="animate-in fade-in duration-500">
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="child-proof-lock">
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" /> Terkunci agar tidak diintip si Kecil
      </p>
      <motion.div
        ref={(el) => {
          trackRef.current = el;
          if (el) setMaxX(el.offsetWidth - 60);
        }}
        style={{ backgroundColor: bg }}
        className="relative h-14 rounded-full overflow-hidden border-2 border-primary/20 select-none"
      >
        <motion.span
          style={{ opacity }}
          className="absolute inset-0 flex items-center justify-center pl-8 text-sm font-semibold text-primary pointer-events-none"
        >
          🔒 Geser untuk Buka Kunci Jawaban
        </motion.span>
        <motion.button
          data-testid="lock-slider-knob"
          drag="x"
          dragConstraints={{ left: 0, right: maxX }}
          dragElastic={0.02}
          dragMomentum={false}
          style={{ x }}
          onDragEnd={handleDragEnd}
          onDoubleClick={() => {
            setUnlocked(true);
            onUnlock && onUnlock();
          }}
          whileTap={{ scale: 1.05 }}
          className="absolute left-1 top-1 h-11 w-11 rounded-full bg-white shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          aria-label="Geser untuk membuka"
        >
          <ChevronsRight className="w-5 h-5 text-primary" />
        </motion.button>
      </motion.div>
      <p className="text-[11px] text-center text-muted-foreground">
        (Bunda/Ayah juga bisa klik dua kali pada tombol untuk membuka)
      </p>
    </div>
  );
};
