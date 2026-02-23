import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextareaAuto = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) onChange(e);
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none overflow-hidden",
          className
        )}
        ref={ref}
        onInput={handleInput}
        {...props}
      />
    )
  }
)
TextareaAuto.displayName = "TextareaAuto"

export { TextareaAuto }
