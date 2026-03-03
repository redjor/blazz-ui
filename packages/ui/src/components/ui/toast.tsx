"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="system"
      richColors
      gap={8}
      offset={16}
      toastOptions={{
        style: {
          "--normal-bg": "var(--bg-overlay)",
          "--normal-border": "var(--border-default)",
          "--normal-text": "var(--text-primary)",
          "--normal-description": "var(--text-secondary)",
        } as React.CSSProperties,
        className: "text-xs! shadow-lg",
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
