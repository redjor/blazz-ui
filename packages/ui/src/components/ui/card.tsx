import type * as React from "react";

import { cn } from "../../lib/utils";

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "bg-surface text-fg",
        "border border-container",
        "rounded-lg",
        "overflow-hidden",
        "has-data-[slot=card-footer]:pb-0",
        "has-[>img:first-child]:pt-0",
        "data-[size=sm]:gap-2 data-[size=sm]:p-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
        "group/card flex flex-col",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5",
        "px-4 pt-4",
        "group-data-[size=sm]/card:pb-3",
        "[.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        "group/card-header @container/card-header grid auto-rows-min items-start",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-sm font-semibold text-fg",
        "group-data-[size=sm]/card:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-fg-muted text-xs", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("group-data-[size=sm]/card:px-2 p-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "bg-raised rounded-b-lg border-t border-separator",
        "p-4 group-data-[size=sm]/card:p-3",
        "flex items-center",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
};

