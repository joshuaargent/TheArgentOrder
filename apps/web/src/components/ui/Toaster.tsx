"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 rounded-md border p-6 pr-8 shadow-lg transition-all",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          actionButton:
            "bg-primary text-primary-foreground rounded-md px-3 py-1 text-sm font-medium hover:bg-primary/90",
          cancelButton:
            "bg-muted text-muted-foreground rounded-md px-3 py-1 text-sm font-medium",
        },
      }}
    />
  );
}
