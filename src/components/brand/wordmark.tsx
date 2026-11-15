import Image from "next/image";

import { cn } from "@/lib/cn";

// Proporcao do arquivo vetorial (viewBox 1226 x 205).
const RATIO = 205 / 1226;

/**
 * Logo completa do NPCP Academy. `dark`: texto grafite, para fundos claros;
 * `light`: texto branco, para o painel grafite. Largura minima de 120px.
 */
export function Wordmark({
  tone,
  width,
  className,
  priority = false,
}: {
  tone: "dark" | "light";
  width: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={tone === "dark" ? "/brand/wordmark-dark.svg" : "/brand/wordmark-white.svg"}
      alt="NPCP Academy"
      width={width}
      height={Math.round(width * RATIO)}
      priority={priority}
      className={cn("h-auto select-none", className)}
    />
  );
}
