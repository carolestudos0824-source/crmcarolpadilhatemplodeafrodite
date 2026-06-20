import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MvpArquiteturaModule } from "./MvpArquiteturaModule";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const writeText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, { clipboard: { writeText } });

const checklistStore: Record<string, boolean> = {};
const setChecklist = vi.fn((updater) => {
  const next = typeof updater === "function" ? updater(checklistStore) : updater;
  Object.assign(checklistStore, next);
});
vi.mock("@/hooks/useUserProgress", () => ({
  useUserProgress: () => ({ checklist: checklistStore, setChecklist }),
}));

describe("MvpArquiteturaModule", () => {
  beforeEach(() => {
    writeText.mockClear();
    setChecklist.mockClear();
    for (const k of Object.keys(checklistStore)) delete checklistStore[k];
  });

  it("renders title, subtitle, highlight, tutorial, 5 etapas and glossary", () => {
    render(<MvpArquiteturaModule />);
    expect(screen.getByRole("heading", { level: 1, name: /Desenhe o MVP e a arquitetura do app/i })).toBeInTheDocument();
    expect(screen.getByText(/transformar o plano do app em uma estrutura simples/i)).toBeInTheDocument();
    expect(screen.getByText(/Um MVP não é o app dos sonhos/i)).toBeInTheDocument();
    expect(screen.getByText(/O que você vai fazer nesta etapa/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Etapa \d/i)).toHaveLength(5);
    expect(screen.getByText(/Não entendi uma palavra/i)).toBeInTheDocument();
    expect(screen.getByText(/Banco de dados/i)).toBeInTheDocument();
  });

  it("switches internal tabs and copies the right prompt", async () => {
    render(<MvpArquiteturaModule />);
    // Card 1 = "Definir o MVP"
    fireEvent.click(screen.getAllByRole("button", { name: /Pensar com o Agente/i })[0]);
    expect(screen.getByText(/transformar minha ideia em um MVP simples/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /Corrigir erro/i })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar correção/i })[0]);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("MVP grande demais"));
    fireEvent.click(screen.getAllByRole("button", { name: /Quando avançar/i })[0]);
    expect(screen.getByText(/Avance quando a primeira versão do app estiver simples/i)).toBeInTheDocument();
  });

  it("copy agent help button copies architect prompt", () => {
    render(<MvpArquiteturaModule />);
    fireEvent.click(screen.getByRole("button", { name: /Não sei desenhar meu MVP/i }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("MVP simples"));
  });

  it("checklist toggles with mvp_step__ prefix", () => {
    render(<MvpArquiteturaModule />);
    const cb = screen.getAllByRole("checkbox")[0];
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
