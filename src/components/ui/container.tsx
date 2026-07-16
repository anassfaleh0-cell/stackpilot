import { cn } from "@/lib/utils"

function Container({ className, children, as: Component = "div", ...props }: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return (
    <Component className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </Component>
  )
}

function Section({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-16 sm:py-24", className)} {...props}>
      {children}
    </section>
  )
}

function SectionHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)} {...props}>
      {children}
    </div>
  )
}

export { Container, Section, SectionHeader }
