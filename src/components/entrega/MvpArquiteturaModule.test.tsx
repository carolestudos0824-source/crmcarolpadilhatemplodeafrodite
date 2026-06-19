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
    const etapa1 = screen.getAllByText(/Etapa 1/i)[0].closest("div")!.parentElement!.parentElement!;
    const scope = within(etapa1);
    fireEvent.click(scope.getByRole("button", { name: /Pensar com o Agente/i }));
    expect(scope.getByText(/transformar minha ideia em um MVP simples/i)).toBeInTheDocument();
    fireEvent.click(scope.getByRole("button", { name: /Corrigir erro/i }));
    fireEvent.click(scope.getByRole("button", { name: /Copiar comando/i }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("MVP grande demais"));
    fireEvent.click(scope.getByRole("button", { name: /Quando avançar/i }));
    expect(scope.queryByRole("button", { name: /Copiar comando/i })).toBeNull();
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

  it("TOTAL_COMMANDS remains 47 and PROGRESS_MODULE_IDS excludes planejar+mvp", async () => {
    const fs = await import("node:fs");
    const entrega = fs.readFileSync("src/pages/Entrega.tsx", "utf8");
    expect(entrega).toMatch(/id !== "planejar" && id !== "mvp"/);
    const m = await import("@/data/entregaModules");
    const total =
      m.COMMANDS_CONSTRUIR.length + m.COMMANDS_LOGIN.length + m.COMMANDS_VENDA.length +
      m.COMMANDS_CHECKOUT.length + m.COMMANDS_SEO.length + m.COMMANDS_CAMPANHAS.length +
      m.COMMANDS_CRIATIVOS.length + m.COMMANDS_VALIDACAO.length + m.COMMANDS_MONETIZACAO.length;
    expect(total).toBe(47);
  });
});
