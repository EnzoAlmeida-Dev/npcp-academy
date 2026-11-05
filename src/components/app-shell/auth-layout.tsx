import type { ReactNode } from "react";

/** x inicial de cada chevron da arte; cor pela etapa que ele representa. */
const CHEVRONS = [
  { x: -60, fill: "#f4f4f5" },
  { x: 70, fill: "#f4f4f5" },
  { x: 200, fill: "#b81825" },
  { x: 330, fill: "#34353b" },
  { x: 460, fill: "#34353b" },
  { x: 590, fill: "#34353b" },
];

function ChevronArt({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 200" className={className}>
      {CHEVRONS.map((chevron, index) => (
        <polygon
          key={chevron.x}
          className="animate-chevron-in"
          style={{ animationDelay: `${index * 80}ms` }}
          fill={chevron.fill}
          points={`${chevron.x},0 ${chevron.x + 110},0 ${chevron.x + 170},100 ${chevron.x + 110},200 ${chevron.x},200 ${chevron.x + 60},100`}
        />
      ))}
    </svg>
  );
}

/** Telas fora da area logada: painel de marca e coluna do formulario. */
export function AuthLayout({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen flex-1 grid-rows-[auto_1fr] bg-surface lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-none">
      <div className="flex items-center justify-between overflow-hidden bg-ink px-6 py-5 lg:hidden">
        <span className="font-heading text-[15px] font-semibold tracking-tight text-white">
          NPCP Academy
        </span>
        <ChevronArt className="-mr-16 h-9 w-auto" />
      </div>

      <aside className="hidden flex-col justify-between overflow-hidden bg-ink p-10 lg:flex">
        <span className="font-heading text-[15px] font-semibold tracking-tight text-white">
          NPCP Academy
        </span>
        <ChevronArt className="w-[115%] max-w-none" />
        <div>
          <p className="max-w-md font-heading text-4xl font-semibold leading-tight tracking-tight text-white">
            Cada trilha concluída libera a próxima.
          </p>
          <p className="mt-3 max-w-md text-sm text-on-ink-muted">
            Capacitação técnica do Núcleo de Projetos de Computação, com
            entregas revisadas e competências registradas.
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {title ? (
            <div className="mb-8">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
                {title}
              </h1>
              {description ? (
                <p className="mt-1 text-sm text-muted">{description}</p>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  );
}
