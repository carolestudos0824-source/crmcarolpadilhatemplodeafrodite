import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MvpArquiteturaModule } from "./MvpArquiteturaModule";
import { AgentChatProvider } from "./AgentChatProvider";

vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));

const renderModule = () =>
  render(
    <AgentChatProvider>
      <MvpArquiteturaModule />
    </AgentChatProvider>,
  );

const writeText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, { clipboard: { writeText } });

const checklistStore: Record<string, boolean> = {};
const setChecklist = vi.fn((updater) => {
  const next = typeof updater === "function" ? updater(checklistStore) : updater;
  Object.assign(checklistStore, next);
});
const commandStore: Record<string, boolean> = {};
vi.mock("@/hooks/useUserProgress", () => ({
  useUserProgress: () => ({
    checklist: checklistStore,
    setChecklist,
    isCommandDone: (k: string) => !!commandStore[k],
    toggleCommand: (k: string) => {
      commandStore[k] = !commandStore[k];
    },
  }),
}));

describe("MvpArquiteturaModule (Blueprint do MVP)", () => {
  beforeEach(() => {
    writeText.mockClear();
    setChecklist.mockClear();
    for (const k of Object.keys(checklistStore)) delete checklistStore[k];
    try {
      window.localStorage.removeItem("fabrica_apps_mvp_stage");
    } catch {
      /* noop */
    }
  });

  it("renders new Blueprint-oriented header, hero do Agente and 5 etapas", () => {
    renderModule();
    expect(
      screen.getByRole("heading", { level: 1, name: /Desenhe o Blueprint do MVP antes de construir/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Desenhe o MVP com o Agente antes de construir/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^Definir o MVP$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Definir telas principais/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Definir dados e banco/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /Decidir login, admin, checkout e área paga/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /Gerar primeiro prompt para o Lovable/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Blueprint do MVP — checklist final/i)).toBeInTheDocument();
  });

  it("stage selector persists and rewrites copied prompts", () => {
    const { unmount } = renderModule();
    const idea = screen.getByRole("radio", { name: /Tenho só uma ideia/i });
    const building = screen.getByRole("radio", { name: /Já estou construindo/i });
    expect(idea.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(screen.getAllByRole("button", { name: /Copiar para implementar no Lovable/i })[0]);
    const ideaCall = writeText.mock.calls.at(-1)?.[0] as string;
    expect(ideaCall).toContain("estrutura de MVP");
    expect(ideaCall).not.toContain("Não recrie tudo do zero");

    writeText.mockClear();
    fireEvent.click(building);
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar para implementar no Lovable/i })[0]);
    const buildCall = writeText.mock.calls.at(-1)?.[0] as string;
    expect(buildCall).toContain("Não recrie tudo do zero");

    expect(window.localStorage.getItem("fabrica_apps_mvp_stage")).toBe("building");
    unmount();
    renderModule();
    expect(
      screen.getByRole("radio", { name: /Já estou construindo/i }).getAttribute("aria-checked"),
    ).toBe("true");
  });

  it("checklist toggles with mvp_step__ prefix for Blueprint items", () => {
    renderModule();
    const span = screen.getByText(/^MVP definido$/);
    fireEvent.click(span);
    expect(setChecklist).toHaveBeenCalled();
    const keys = Object.keys(checklistStore);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.every((k) => k.startsWith("mvp_step__"))).toBe(true);
  });

  it("TOTAL_COMMANDS preserved and planejar+mvp tracked via AUTO_MODULE_CHECKLIST", async () => {
    const fs = await import("node:fs");
    const entrega = fs.readFileSync("src/pages/Entrega.tsx", "utf8");
    expect(entrega).toMatch(/AUTO_MODULE_CHECKLIST/);
    expect(entrega).toMatch(/id:\s*"planejar"/);
    expect(entrega).toMatch(/id:\s*"mvp"/);
    const m = await import("@/data/entregaModules");
    const total =
      m.COMMANDS_CONSTRUIR.length + m.COMMANDS_LOGIN.length + m.COMMANDS_VENDA.length +
      m.COMMANDS_CHECKOUT.length + m.COMMANDS_SEO.length + m.COMMANDS_CAMPANHAS.length +
      m.COMMANDS_CRIATIVOS.length + m.COMMANDS_VALIDACAO.length + m.COMMANDS_MONETIZACAO.length;
    expect(total).toBe(54);
  });
});
