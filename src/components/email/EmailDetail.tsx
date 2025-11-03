"use client"

import Image from "next/image"
import { Mail, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmailContent } from "@/components/email/EmailContent"
import { getProviderLogo } from "@/lib/utils/logo"
import type { Email } from "@/types"

export function EmailDetail({ email }: { email: Email | null }) {
  if (!email) {
    return (
      <div className="flex h-full items-center justify-center px-8">
        <div className="memphis-panel flex flex-col items-center gap-5 px-12 py-14 text-center backdrop-blur-xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border-2 border-border bg-primary/10 shadow-[0_12px_0_rgba(36,17,61,0.14)]">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-black text-foreground">选择一封邮件</h3>
          <p className="max-w-xs text-sm text-muted-foreground opacity-80">
            从左侧列表中选择一封邮件以查看详细内容
          </p>
        </div>
      </div>
    )
  }

  const logo = getProviderLogo(email.fromAddress)

  const formatFullTime = (sentAt: string | null): string => {
    if (!sentAt) return ""
    const date = new Date(sentAt)
    if (Number.isNaN(date.getTime())) return ""

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b-2 border-border px-10 py-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.75rem] border-2 border-border bg-primary/10 shadow-[0_12px_0_rgba(36,17,61,0.16)]">
              {logo ? (
                <Image src={logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
              ) : (
                <span className="text-2xl font-black uppercase tracking-[0.3em] text-primary">
                  {email.fromName?.[0] || "?"}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="max-w-xl text-xl font-black text-foreground">
                {email.fromName}
              </h2>
              <p className="text-sm text-muted-foreground opacity-80">
                {email.fromAddress}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="rounded-full bg-secondary/20 px-3 py-1 font-semibold uppercase tracking-[0.3em] text-secondary-foreground">
                  {formatFullTime(email.sentAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="mt-8 rounded-[1.5rem] bg-card px-6 py-4 text-base font-semibold leading-relaxed text-foreground shadow-[0_12px_0_rgba(36,17,61,0.16)]">
          {email.subject}
        </h3>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6 px-10 py-8">
            <EmailContent
              bodyHtml={email.bodyHtml}
              bodyText={email.bodyText}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
