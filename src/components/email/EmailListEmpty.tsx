"use client";

import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTranslation from "@/lib/hooks/useTranslation";

export default function EmailListEmpty({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Mail className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{t("noEmails")}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{t("noEmailsDesc")}</p>
      <Button
        onClick={() => {
          void onRefresh();
        }}
        className="rounded-xl"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        {t("refreshEmails")}
      </Button>
    </div>
  );
}
