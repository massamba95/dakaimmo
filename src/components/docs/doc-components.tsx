import { ImageIcon, Lightbulb, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface ScreenshotProps {
  src?: string;
  alt?: string;
  caption: string;
  filename?: string;
}

export function Screenshot({ src, alt, caption, filename, placeholder }: ScreenshotProps & { placeholder?: boolean }) {
  const finalSrc = src ?? (filename ? `/docs/${filename}` : null);

  if (finalSrc && !placeholder) {
    return (
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={finalSrc}
          alt={alt ?? caption}
          className="w-full rounded-lg border shadow-sm"
        />
        <figcaption className="mt-2 text-xs text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      </figure>
    );
  }
  return (
    <div className="my-6 rounded-lg border-2 border-dashed border-muted p-8 text-center">
      <ImageIcon className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{caption}</p>
      {filename && (
        <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
          /public/docs/{filename}
        </p>
      )}
    </div>
  );
}

interface CalloutProps {
  type?: "tip" | "warning" | "info" | "success";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const config = {
    tip:     { icon: Lightbulb,      bg: "bg-amber-50",  border: "border-amber-200",  iconColor: "text-amber-600",  titleColor: "text-amber-900" },
    warning: { icon: AlertTriangle,  bg: "bg-red-50",    border: "border-red-200",    iconColor: "text-red-600",    titleColor: "text-red-900" },
    info:    { icon: Info,           bg: "bg-blue-50",   border: "border-blue-200",   iconColor: "text-blue-600",   titleColor: "text-blue-900" },
    success: { icon: CheckCircle2,   bg: "bg-green-50",  border: "border-green-200",  iconColor: "text-green-600",  titleColor: "text-green-900" },
  }[type];
  const Icon = config.icon;

  return (
    <div className={`my-5 rounded-lg border ${config.border} ${config.bg} p-4 flex gap-3`}>
      <Icon className={`h-5 w-5 ${config.iconColor} shrink-0 mt-0.5`} />
      <div className="flex-1 text-sm">
        {title && <p className={`font-semibold mb-1 ${config.titleColor}`}>{title}</p>}
        <div className="text-foreground/80 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <h3 className="font-semibold text-base mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}
