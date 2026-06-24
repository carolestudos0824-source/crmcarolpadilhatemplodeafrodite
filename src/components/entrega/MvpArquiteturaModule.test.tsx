import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MvpArquiteturaModule } from "./MvpArquiteturaModule";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

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

describe("MvpArquiteturaModule", () => {
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

  it("stage selector: shows 3 options, defaults to 'idea', persists choice and rewrites copied prompts", () => {
    const { unmount } = render(<MvpArquiteturaModule />);
    // 3 options visible
    const idea = screen.getByRole("radio", { name: /Tenho só uma ideia/i });
    const building = screen.getByRole("radio", { name: /Já estou construindo/i });
    const ready = screen.getByRole("radio", { name: /Já tenho app pronto/i });
    expect(idea).toBeInTheDocument();
    expect(building).toBeInTheDocument();
    expect(ready).toBeInTheDocument();
    // default = idea
    expect(idea.getAttribute("aria-checked")).toBe("true");
    expect(building.getAttribute("aria-checked")).toBe("false");

    // With 'idea', copied prompt has no stage prefix
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar para implementar no Lovable/i })[0]);
    const ideaCall = writeText.mock.calls.at(-1)?.[0] as string;
    expect(ideaCall).toContain("estrutura de MVP");
    expect(ideaCall).not.toContain("Não recrie tudo do zero");
    expect(ideaCall).not.toContain("Não recrie o MVP");

    // Switch to 'building' → prompt gains the building prefix
    writeText.mockClear();
    fireEvent.click(building);
    expect(building.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar para implementar no Lovable/i })[0]);
    const buildCall = writeText.mock.calls.at(-1)?.[0] as string;
    expect(buildCall).toContain("Não recrie tudo do zero");
    expect(buildCall).toContain("estrutura de MVP");

    // Switch to 'ready' → prompt gains the ready prefix
    writeText.mockClear();
    fireEvent.click(ready);
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar para implementar no Lovable/i })[0]);
    const readyCall = writeText.mock.calls.at(-1)?.[0] as string;
    expect(readyCall).toContain("Não recrie o MVP");

    // Persistence: choice saved to localStorage and restored on remount
    expect(window.localStorage.getItem("fabrica_apps_mvp_stage")).toBe("ready");
    unmount();
    render(<MvpArquiteturaModule />);
    expect(
      screen.getByRole("radio", { name: /Já tenho app pronto/i }).getAttribute("aria-checked"),
    ).toBe("true");
  });


  it("renders title, subtitle, highlight, tutorial, 5 etapas and glossary", () => {
    render(<MvpArquiteturaModule />);
    expect(screen.getByRole("heading", { level: 1, name: /Desenhe o MVP e a arquitetura do app/i })).toBeInTheDocument();
    expect(screen.getByText(/transformar o plano do app em uma estrutura simples/i)).toBeInTheDocument();
    expect(screen.getByText(/Um MVP não é o app dos sonhos/i)).toBeInTheDocument();
    expect(screen.getByText(/O que você vai fazer nesta etapa/i)).toBeInTheDocument();
    // 5 etapa cards via CommandCard (title visible for each)
    expect(screen.getByRole("heading", { level: 3, name: /Definir o MVP/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Listar funcionalidades essenciais/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Mapear telas necessárias/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Definir dados e banco/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Arquitetura pronta para o Lovable/i })).toBeInTheDocument();
    // Three-path rule visible on main cards
    expect(screen.getAllByRole("button", { name: /Copiar auditoria para o Lovable/i }).length).toBeGreaterThanOrEqual(5);
    expect(screen.getAllByText(/Somente auditoria\./i).length).toBeGreaterThanOrEqual(5);
    expect(screen.getByText(/Não entendi uma palavra/i)).toBeInTheDocument();
    expect(screen.getByText(/Banco de dados/i)).toBeInTheDocument();
  });

  it("switches internal tabs and copies the right prompt", async () => {
    render(<MvpArquiteturaModule />);
    // Card 1 = "Definir o MVP"
    fireEvent.click(screen.getAllByRole("button", { name: /Revisar com o Agente primeiro/i })[0]);
    expect(screen.getByText(/transformar minha ideia em um MVP simples/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /Corrigir erro/i })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar correção/i })[0]);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("MVP grande demais"));
    fireEvent.click(screen.getAllByRole("button", { name: /Quando avançar/i })[0]);
    expect(screen.getAllByText(/Avance quando a primeira versão do app estiver simples/i).length).toBeGreaterThan(0);
  });

  it("copy agent help button copies architect prompt", () => {
    render(<MvpArquiteturaModule />);
    fireEvent.click(screen.getByRole("button", { name: /Não sei desenhar meu MVP/i }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("MVP simples"));
  });

  it("checklist toggles with mvp_step__ prefix", () => {
    render(<MvpArquiteturaModule />);
    // Use the module review checklist label (CommandCard also renders its own
    // command-done checkboxes — target the module checklist explicitly).
    const cb = screen.getByLabelText(/Defini o MVP do meu app/i);
    fireEvent.click(cb);
    expect(setChecklist).toHaveBeenCalled();
    const keys = Object.keys(checklistStore);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.every((k) => k.startsWith("mvp_step__"))).toBe(true);
  });

  it("TOTAL_COMMANDS preserved and planejar+mvp tracked via AUTO_MODULE_CHECKLIST", async () => {
    const fs = await import("node:fs");
    const entrega = fs.readFileSync("src/pages/Entrega.tsx", "utf8");
    // planejar/mvp now count toward progress automatically via the internal
    // checklist (see AUTO_MODULE_CHECKLIST in Entrega.tsx), not via exclusion.
    expect(entrega).toMatch(/AUTO_MODULE_CHECKLIST/);
    expect(entrega).toMatch(/id:\s*"planejar"/);
    expect(entrega).toMatch(/id:\s*"mvp"/);
    const m = await import("@/data/entregaModules");
    const total =
      m.COMMANDS_CONSTRUIR.length + m.COMMANDS_LOGIN.length + m.COMMANDS_VENDA.length +
      m.COMMANDS_CHECKOUT.length + m.COMMANDS_SEO.length + m.COMMANDS_CAMPANHAS.length +
      m.COMMANDS_CRIATIVOS.length + m.COMMANDS_VALIDACAO.length + m.COMMANDS_MONETIZACAO.length;
    // snapshot current value to detect drift caused by new modules
    expect(total).toBe(54);
  });
});
