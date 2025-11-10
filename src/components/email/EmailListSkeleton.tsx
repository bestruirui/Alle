"use client";

export default function EmailListSkeleton() {
  return (
    <div className="divide-y divide-border">
      {[1, 2, 3].map((item) => (
        <div key={item} className="px-6 py-5 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
