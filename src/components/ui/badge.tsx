import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-subtle text-primary-dark",
        secondary: "bg-muted-bg text-muted-foreground",
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        danger: "bg-error-subtle text-error",
        outline: "border border-border text-muted-foreground bg-transparent",
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
