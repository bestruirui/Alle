"use client"

import { Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/hooks/useTranslation"

export function EmailListEmpty({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="memphis-panel relative flex w-full max-w-md flex-col items-center gap-6 px-10 py-12 backdrop-blur-xl">
        <span className="memphis-chip absolute -top-5 left-1/2 -translate-x-1/2 shadow-[0_6px_0_rgba(36,17,61,0.12)]">Empty</span>
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border-2 border-border bg-primary/10 shadow-[0_12px_0_rgba(36,17,61,0.12)]">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-black text-foreground">{t("noEmails")}</h3>
          <p className="text-sm text-muted-foreground opacity-80">{t("noEmailsDesc")}</p>
        </div>
        <Button
          onClick={() => {
            void onRefresh()
          }}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("refreshEmails")}
        </Button>
      </div>
    </div>
  )
}
