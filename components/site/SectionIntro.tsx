import { cn } from "@/lib/utils";

export function SectionIntro({
  label,
  heading,
  subtitle,
  align = "center",
  light = false,
}: {
  label?: string;
  heading?: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  if (!heading && !label && !subtitle) return null;

  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {label && (
        <p
          className={cn(
            "text-xs font-semibold tracking-[0.2em] uppercase",
            light ? "text-gold-400" : "text-gold-600"
          )}
        >
          {label}
        </p>
      )}
      {heading && (
        <h2
          className={cn(
            "mt-4 text-3xl font-semibold sm:text-4xl",
            light ? "text-white" : "text-foreground"
          )}
        >
          {heading}
        </h2>
      )}
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            light ? "text-navy-200" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
