"use client";

export function EmailListSkeleton() {
  return (
    <div className="space-y-4 px-6 py-6">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-[1.75rem] border-2 border-border bg-card px-6 py-5 shadow-[0_10px_0_rgba(36,17,61,0.12)] animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-[1.5rem] bg-primary/20" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="h-3 w-2/3 rounded-full bg-primary/20" />
              <div className="h-3 w-1/2 rounded-full bg-secondary/20" />
              <div className="h-10 w-full rounded-[1.25rem] bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
