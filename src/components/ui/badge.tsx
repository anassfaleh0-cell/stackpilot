import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        secondary: "bg-muted-bg text-muted",
        success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        danger: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
