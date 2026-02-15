"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-md text-sm font-medium",
    "transition-colors duration-150 ease-out",
    "outline-none select-none shrink-0",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "group/button",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-brand text-brand-fg",
          "hover:bg-brand-hover",
          "active:brightness-90",
          "focus-visible:ring-2 focus-visible:ring-brand/40",
        ],
        outline: [
          "bg-transparent border border-edge text-fg",
          "hover:bg-raised",
          "active:bg-panel",
          "aria-expanded:bg-raised",
          "focus-visible:ring-2 focus-visible:ring-brand/40",
        ],
        secondary: [
          "bg-raised text-fg",
          "hover:bg-panel",
          "active:brightness-95",
          "aria-expanded:bg-panel",
          "focus-visible:ring-2 focus-visible:ring-brand/40",
        ],
        ghost: [
          "text-fg",
          "hover:bg-raised",
          "active:bg-panel",
          "aria-expanded:bg-raised",
          "focus-visible:ring-2 focus-visible:ring-brand/40",
        ],
        destructive: [
          "bg-negative text-white",
          "hover:brightness-110",
          "active:brightness-90",
          "focus-visible:ring-2 focus-visible:ring-negative/40",
        ],
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs rounded-sm has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-xs rounded has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8 p-0",
        "icon-xs":
          "size-6 p-0 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 p-0 rounded",
        "icon-lg": "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
