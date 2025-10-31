import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function LoadingPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <RefreshCw className="h-12 w-12 text-muted-foreground" />
        </motion.div>
        <p className="text-sm text-muted-foreground">加载中...</p>
      </motion.div>
    </main>
  );
}
