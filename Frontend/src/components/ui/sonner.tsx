import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:font-bold",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:font-medium group-[.toast]:italic",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-black uppercase tracking-widest",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-black uppercase tracking-widest",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
