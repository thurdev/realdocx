import type { ToastRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";

export { default as Toast } from "./Toast.vue";
export { default as ToastAction } from "./ToastAction.vue";
export { default as ToastClose } from "./ToastClose.vue";
export { default as ToastDescription } from "./ToastDescription.vue";
export { default as Toaster } from "./Toaster.vue";
export { default as ToastProvider } from "./ToastProvider.vue";
export { default as ToastTitle } from "./ToastTitle.vue";
export { default as ToastViewport } from "./ToastViewport.vue";
export { toast, useToast } from "./use-toast";

import { cva, type VariantProps } from "class-variance-authority";

export const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-zinc-200 p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[--reka-toast-swipe-end-x] data-[swipe=move]:translate-x-[--reka-toast-swipe-move-x] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-zinc-800",
  {
    variants: {
      variant: {
        default:
          "border bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50",
        errors:
          "destructive group border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900 dark:text-zinc-50",
        success:
          "group border-green-500 bg-green-500 text-zinc-50 dark:border-green-900 dark:bg-green-900 dark:text-zinc-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ToastVariants = VariantProps<typeof toastVariants>;

export interface ToastProps extends ToastRootProps {
  class?: HTMLAttributes["class"];
  variant?: ToastVariants["variant"];
  onOpenChange?: ((value: boolean) => void) | undefined;
}
