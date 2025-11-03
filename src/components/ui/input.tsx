import * as React from "react"

import { cn } from "@/lib/utils/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-11 w-full min-w-0 rounded-2xl border-2 border-border bg-card px-4 py-2 text-base shadow-[0_8px_0_rgba(36,17,61,0.08)] transition-[color,box-shadow,transform] outline-none file:inline-flex file:h-8 file:rounded-xl file:border-0 file:bg-transparent file:px-4 file:text-sm file:font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:-translate-y-0.5 focus-visible:border-primary focus-visible:ring-ring/40 focus-visible:ring-[4px]",
        "aria-invalid:ring-destructive/25 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
