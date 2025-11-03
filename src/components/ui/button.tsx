import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border-2 border-transparent px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-ring/40 focus-visible:ring-[4px] enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 aria-invalid:ring-destructive/25 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_12px_0_rgba(255,92,141,0.16)] hover:shadow-[0_16px_0_rgba(255,92,141,0.22)]",
        destructive:
          "bg-destructive text-primary-foreground shadow-[0_12px_0_rgba(255,140,66,0.18)] hover:shadow-[0_16px_0_rgba(255,140,66,0.24)] focus-visible:ring-destructive/30 dark:bg-destructive",
        outline:
          "border-border bg-card text-foreground shadow-[0_10px_0_rgba(36,17,61,0.08)] hover:border-primary hover:bg-primary/10 dark:bg-background/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_12px_0_rgba(49,211,198,0.18)] hover:shadow-[0_16px_0_rgba(49,211,198,0.26)]",
        ghost:
          "border-2 border-transparent bg-transparent text-foreground hover:border-border hover:bg-primary/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 has-[>svg]:px-4",
        sm: "h-9 rounded-xl gap-1.5 px-4 text-sm has-[>svg]:px-3",
        lg: "h-12 rounded-3xl px-7 text-base has-[>svg]:px-5",
        icon: "size-11 rounded-2xl",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-12 rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
