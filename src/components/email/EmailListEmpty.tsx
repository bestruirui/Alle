"use client";

import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function EmailListEmpty({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center p-10">
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div
          className="absolute top-[20%] left-[25%] w-16 h-16 rounded-full border-[4px] border-[var(--memphis-pink)]"
          style={{ animation: "memphisPulse 3s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[25%] right-[20%] w-12 h-12"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: "var(--memphis-yellow)",
            animation: "memphisFloat 6s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[var(--memphis-cyan)]/20 to-[var(--memphis-purple)]/15 flex items-center justify-center mb-6 border-[4px] border-border shadow-[8px_8px_0_var(--memphis-yellow)]">
          <Mail className="h-14 w-14 text-[var(--memphis-purple)]" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-wider text-foreground mb-3">
          {t("noEmails")}
        </h3>
        <p className="text-base font-medium text-muted-foreground max-w-sm mb-8">
          {t("noEmailsDesc")}
        </p>
        <Button
          onClick={() => {
            void onRefresh();
          }}
          className="memphis-btn rounded-xl bg-gradient-to-r from-[var(--memphis-pink)] to-[var(--memphis-purple)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:from-[var(--memphis-cyan)] hover:to-[var(--memphis-yellow)]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refreshEmails")}
        </Button>
      </div>
    </div>
  );
}
