import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ClipboardCheck, Route, Target } from "lucide-react";

import { NavIcon } from "@/components/app-shell/nav-icons";
import { Card } from "@/components/ui/card";
import { ProgressChevrons } from "@/components/ui/progress-chevrons";
import { SectionTitle } from "@/components/ui/section-title";
import { SegmentedBar } from "@/components/ui/segmented-bar";
import { StatStrip } from "@/components/ui/stat-strip";
import { StepList, type Step } from "@/components/ui/step-list";
import {
  countOpenInvitations,
  summarizeUsers,
} from "@/features/dashboard/summary";
import { listInvitations } from "@/features/invitations/queries";
import { listUsersForAdmin } from "@/features/profiles/queries";
import { hasRoleAtLeast, ROLE_LABELS } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { getNavItemsForRole } from "@/lib/navigation";

export const metadata: Metadata = { title: "Dashboard" };

// Conta ativada e nome definido sao garantidos pelo app shell.
const FIRST_STEPS: Step[] = [
  { key: "account", title: "Conta ativada", status: "done" },
  { key: "name", title: "Nome de exibição definido", status: "done" },
  {
    key: "path",
    title: "Começar a primeira trilha",
    description: "Disponível quando a primeira trilha for publicada.",
    status: "locked",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Route,
    title: "Trilhas em sequência",
    text: "Concluir uma trilha libera a próxima.",
  },
  {
    icon: ClipboardCheck,
    title: "Entregas revisadas",
    text: "Exercícios e projetos passam por um responsável técnico, que aprova ou pede ajustes.",
  },
  {
    icon: Target,
    title: "Competências demonstradas",
    text: "Uma entrega aprovada demonstra as competências associadas à atividade.",
  },
];

async function ManagerOverview({
  shortcuts,
}: {
  shortcuts: ReturnType<typeof getNavItemsForRole>;
}) {
  const [users, invitations] = await Promise.all([
    listUsersForAdmin(),
    listInvitations(),
  ]);

  // Quem ve esta secao e um gerente ativo: lista vazia indica falha na consulta.
  if (users.length === 0) {
    return null;
  }

  const summary = summarizeUsers(users);

  return (
    <>
      <section aria-labelledby="overview" className="flex flex-col gap-3">
        <SectionTitle id="overview">Visão geral</SectionTitle>
        <StatStrip
          stats={[
            { label: "Contas ativas", value: summary.active },
            { label: "Aguardando ativação", value: summary.pendingActivation },
            { label: "Contas desativadas", value: summary.disabled },
            { label: "Convites em aberto", value: countOpenInvitations(invitations) },
          ]}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <SectionTitle>Contas ativas por papel</SectionTitle>
          <div className="mt-5">
            <SegmentedBar
              label="Contas ativas por papel"
              parts={[
                {
                  key: "member",
                  label: ROLE_LABELS.member,
                  value: summary.activeByRole.member,
                  color: "var(--color-role-member)",
                },
                {
                  key: "reviewer",
                  label: ROLE_LABELS.reviewer,
                  value: summary.activeByRole.reviewer,
                  color: "var(--color-role-reviewer)",
                },
                {
                  key: "manager",
                  label: ROLE_LABELS.manager,
                  value: summary.activeByRole.manager,
                  color: "var(--color-role-manager)",
                },
              ]}
            />
          </div>
        </Card>

        <Card flush>
          <ul className="divide-y divide-border">
            {shortcuts.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-sheet"
                >
                  <NavIcon name={item.key} className="size-4 shrink-0 text-muted" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-ink">{item.label}</span>
                    <span className="block truncate text-ui text-muted">
                      {item.description}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return null;
  }

  const shortcuts = getNavItemsForRole(profile.role).filter(
    (item) => item.status === "available" && item.href !== "/dashboard",
  );
  const done = FIRST_STEPS.filter((step) => step.status === "done").length;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink">
        Olá, {profile.display_name}
      </h1>

      {hasRoleAtLeast(profile.role, "manager") ? (
        <ManagerOverview shortcuts={shortcuts} />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-4">
        <Card>
          <div className="flex items-baseline justify-between gap-4">
            <SectionTitle>Primeiros passos</SectionTitle>
            <p className="text-ui text-muted">
              {done} de {FIRST_STEPS.length} etapas
            </p>
          </div>
          <ProgressChevrons
            className="mb-6 mt-4"
            value={done}
            total={FIRST_STEPS.length}
            label="Primeiros passos"
          />
          <StepList steps={FIRST_STEPS} />
        </Card>

        <section aria-labelledby="how-it-works" className="lg:px-4 lg:py-6">
          <SectionTitle id="how-it-works">Como funciona</SectionTitle>
          <ul className="mt-4 flex flex-col gap-4">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.title} className="flex gap-3">
                <item.icon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted"
                />
                <div>
                  <p className="text-sm text-ink">{item.title}</p>
                  <p className="mt-0.5 text-ui text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
