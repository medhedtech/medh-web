import * as React from "react"
import { cn } from "@/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
  variant?: "default" | "muted" | "primary" | "secondary"
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ 
    className, 
    orientation = "horizontal", 
    decorative = true, 
    variant = "default",
    ...props 
  }, ref) => {
    const variantClasses = {
      default: "bg-gray-200 dark:bg-gray-700",
      muted: "bg-gray-100 dark:bg-gray-800",
      primary: "bg-primary-100 dark:bg-primary-900",
      secondary: "bg-secondary-100 dark:bg-secondary-900",
    }

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          "shrink-0 transition-colors",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
        aria-orientation={orientation}
        role={decorative ? "none" : "separator"}
      />
    )
  }
)

Separator.displayName = "Separator"

export { Separator } 