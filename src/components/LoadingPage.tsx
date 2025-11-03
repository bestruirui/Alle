import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function LoadingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-10 left-[12%] w-32 h-32 rounded-full border-[8px] border-[var(--memphis-cyan)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ opacity: 0.4 }}
        />

        <motion.div
          className="absolute bottom-[18%] right-[15%] w-20 h-20"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: "linear-gradient(135deg, var(--memphis-pink), var(--memphis-purple))",
            boxShadow: "8px 8px 0 rgba(0,0,0,0.12)",
            opacity: 0.55,
          }}
          animate={{ rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        />

        <motion.div
          className="absolute top-[30%] right-[8%] w-32 h-3"
          style={{
            background: "repeating-linear-gradient(90deg, var(--memphis-yellow) 0, var(--memphis-yellow) 12px, transparent 12px, transparent 24px)",
            opacity: 0.55,
          }}
          animate={{ x: [0, 18, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="memphis-card bg-card/95 backdrop-blur-sm rounded-3xl px-10 py-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-[var(--memphis-purple)] bg-[var(--memphis-yellow)] shadow-[6px_6px_0_var(--memphis-cyan)]"
          >
            <RefreshCw className="h-10 w-10 text-[var(--memphis-pink)]" />
          </motion.div>

          <motion.h2
            className="text-3xl font-black tracking-[0.2em] uppercase text-foreground"
            animate={{ letterSpacing: ["0.2em", "0.4em", "0.2em"] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            Loading
          </motion.h2>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            复古浪潮加载中 · 请稍候
          </p>
        </div>
      </motion.section>
    </main>
  );
}
