import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TesteFinalModule } from "./TesteFinalModule";

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

describe("TesteFinalModule", () => {
  beforeEach(() => {
    writeText.mockClear();
    setChecklist.mockClear();
    for (const k of Object.keys(checklistStore)) delete checklistStore[k];
  });

  it("renders title, subtitle, highlight, tutorial, 5 etapas and glossary", () => {
    render(<TesteFinalModule />);
    expect(screen.getByRole("heading", { level: 1, name: /Teste tudo antes de divulgar/i })).toBeInTheDocument();
    expect(screen.getAllByText(/testar botões/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Um app bonito ainda pode estar quebrado/i)).toBeInTheDocument();
    expect(screen.getByText(/O que você vai fazer nesta etapa/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Etapa \d/i)).toHaveLength(5);
    expect(screen.getByText(/Não entendi uma palavra/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Scroll horizontal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Como usar os comandos/i)).toBeInTheDocument();
  });

  it("tabs switch and copy buttons work with preamble", () => {
    render(<TesteFinalModule />);
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar comando/i })[0]);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Contexto: estou no projeto"));
    fireEvent.click(screen.getAllByRole("button", { name: /Pensar com o Agente/i })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar para o Agente/i })[0]);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("visitante"));
    fireEvent.click(screen.getAllByRole("button", { name: /Corrigir erro/i })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /Copiar correção/i })[0]);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Contexto: estou no projeto"));
  });

  it("agent help button copies the help prompt", () => {
    render(<TesteFinalModule />);
    fireEvent.click(screen.getByRole("button", { name: /Não sei testar meu app/i }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("teste final antes de divulgar"));
  });

  it("checklist toggles with teste_step__ prefix", () => {
    render(<TesteFinalModule />);
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    const keys = Object.keys(checklistStore);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.every((k) => k.startsWith("teste_step__"))).toBe(true);
  });
});
