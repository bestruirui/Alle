import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function LoadingPage() {
  return (
    <main className="min-h-screen memphis-pattern relative flex items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="memphis-shape memphis-shape--triangle -left-28 top-10"
          animate={{ rotate: [0, 20, -10, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
        <motion.div
          className="memphis-shape memphis-shape--circle bottom-[-140px] right-[-60px]"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="memphis-panel flex flex-col items-center gap-5 px-12 py-10 text-center backdrop-blur-xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border-2 border-border bg-primary/10 shadow-[0_10px_0_rgba(36,17,61,0.12)]"
          >
            <RefreshCw className="h-10 w-10 text-primary" />
          </motion.div>
          <div>
            <p className="text-lg font-semibold uppercase tracking-[0.3em] text-muted-foreground">Loading</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground opacity-80">
              色块与线条正在调频，稍等片刻即可进入孟菲斯风格的邮箱宇宙。
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
