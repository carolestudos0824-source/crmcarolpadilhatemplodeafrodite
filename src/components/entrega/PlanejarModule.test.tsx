import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { PlanejarModule } from "./PlanejarModule";

// Mock toast (no-op)
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// Mock clipboard
const writeText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, { clipboard: { writeText } });

// Mock progress hook
const checklistStore: Record<string, boolean> = {};
const setChecklist = vi.fn((updater) => {
  const next =
    typeof updater === "function" ? updater(checklistStore) : updater;
  Object.assign(checklistStore, next);
});
vi.mock("@/hooks/useUserProgress", () => ({
  useUserProgress: () => ({
    checklist: checklistStore,
    setChecklist,
  }),
}));

describe("PlanejarModule", () => {
  beforeEach(() => {
    writeText.mockClear();
    setChecklist.mockClear();
    for (const k of Object.keys(checklistStore)) delete checklistStore[k];
  });

  it("renders title, subtitle, highlight, tutorial steps and glossary", () => {
    render(<PlanejarModule />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Planeje seu app antes de construir/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Antes de abrir o Lovable, você precisa saber qual problema/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Um app começa antes do código/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Defina o problema que o app resolve\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/^MVP$/)).toBeInTheDocument();
    expect(screen.getByText(/^Escopo$/)).toBeInTheDocument();
  });

  it("renders all 5 etapas with their titles", () => {
    render(<PlanejarModule />);
    [
      "Definir problema e público",
      "Escrever a promessa do app",
      "Definir ação principal",
      "Separar essencial de extra",
      "Criar plano inicial do app",
    ].forEach((t) => {
      expect(screen.getByRole("heading", { name: t })).toBeInTheDocument();
    });
    expect(screen.getAllByText(/^Etapa \d$/)).toHaveLength(5);
  });

  it("switches tabs inside an etapa and updates content", () => {
    render(<PlanejarModule />);
    // Default tab "Fazer no Lovable" shows the lovable prompt of etapa 1
    expect(
      screen.getByText(/Crie uma seção de planejamento para meu app/i),
    ).toBeInTheDocument();
    // Click "Pensar com o Agente" on etapa 1
    const agentBtns = screen.getAllByRole("button", { name: /Pensar com o Agente/i });
    fireEvent.click(agentBtns[0]);
    expect(
      screen.getByText(/Me ajude a definir o problema e o público do meu app/i),
    ).toBeInTheDocument();
    // "Quando avançar" hides the copy button
    fireEvent.click(screen.getAllByRole("button", { name: /Quando avançar/i })[0]);
    expect(
      screen.getByText(/Avance quando você conseguir dizer em uma frase/i),
    ).toBeInTheDocument();
  });

  it("copy button writes prompt to clipboard", async () => {
    render(<PlanejarModule />);
    const copyBtns = screen.getAllByRole("button", { name: /^Copiar comando$/i });
    fireEvent.click(copyBtns[0]);
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toMatch(/Crie uma seção de planejamento/i);
  });


  it("agent help button copies the architect prompt", () => {
    render(<PlanejarModule />);
    fireEvent.click(screen.getByRole("button", { name: /Não sei planejar meu app/i }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toMatch(
      /Estou criando um aplicativo do zero com IA e preciso planejar/i,
    );
  });

  it("checklist toggles via setChecklist with isolated planejar_step__ prefix", () => {
    render(<PlanejarModule />);
    const cb = screen.getAllByRole("checkbox")[0] as HTMLInputElement;
    fireEvent.click(cb);
    expect(setChecklist).toHaveBeenCalledTimes(1);
    // Key must be prefixed to avoid colliding with the global CHECKLIST_PHASES progress
    const stored = Object.keys(checklistStore);
    expect(stored.length).toBe(1);
    expect(stored[0].startsWith("planejar_step__")).toBe(true);
    expect(checklistStore[stored[0]]).toBe(true);
  });
});
