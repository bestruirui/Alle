"use client";

export function EmailListSkeleton() {
  return (
    <div className="divide-y-[3px] divide-border/30">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="px-6 py-5 animate-pulse">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--memphis-cyan)]/20 to-[var(--memphis-purple)]/20 border-[3px] border-border shadow-[4px_4px_0_var(--memphis-yellow)]/20" />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="h-5 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-3/4 shadow-sm" />
              <div className="h-4 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-1/2" />
              <div className="h-12 bg-gradient-to-r from-muted to-muted/50 rounded-xl border-[3px] border-border/30" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
