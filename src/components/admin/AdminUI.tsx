"use client";

import { forwardRef } from "react";
import type {
  ComponentPropsWithoutRef,
  HTMLAttributes,
} from "react";

const merge = (base: string, extra?: string) =>
  extra ? `${base} ${extra}` : base;

export function AdminContainer({
  className,
  ...props
}: ComponentPropsWithoutRef<"main">) {
  return (
    <main
      className={merge(
        "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}

export function AdminPageHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      className={merge(
        "text-2xl font-semibold leading-tight text-slate-900 lg:text-3xl",
        className,
      )}
      {...props}
    />
  );
}

export function AdminCard({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={merge(
        "rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm transition hover:shadow-md lg:p-7",
        className,
      )}
      {...props}
    />
  );
}

export function AdminCardTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={merge(
        "mb-4 text-lg font-semibold leading-6 text-slate-900 lg:text-xl",
        className,
      )}
      {...props}
    />
  );
}

export function SectionLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={merge(
        "text-sm font-semibold text-slate-600",
        className,
      )}
      {...props}
    />
  );
}

export const SmallButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={merge(
      "inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));

SmallButton.displayName = "SmallButton";

export function Actions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={merge("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export function MetaRow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={merge(
        "flex flex-wrap items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

export function MetaItem({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={merge(
        "flex min-w-[200px] flex-col gap-1",
        className,
      )}
      {...props}
    />
  );
}

export function MetaLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={merge("text-xs font-medium text-slate-500", className)}
      {...props}
    />
  );
}

export function MetaValue({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={merge("text-sm font-semibold text-slate-900", className)}
      {...props}
    />
  );
}

export function OptionIndex({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={merge(
        "inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-xs font-medium text-slate-500",
        className,
      )}
      {...props}
    />
  );
}
