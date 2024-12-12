import * as React from "react"
import { Toaster as Sonner, toast } from "sonner"

const Toaster = () => {
  return (
    <Sonner 
      className="toaster group" 
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  )
}

export { Toaster }

// Hook for managing notifications
export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    error: (message: string) => {
      toast.error(message, {
        duration: 3000,
      })
    },
    success: (message: string) => {
      toast.success(message, {
        duration: 2000,
      })
    }
  }
}