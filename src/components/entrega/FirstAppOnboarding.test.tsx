import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FirstAppOnboarding } from "./FirstAppOnboarding";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

const mockUseAppProjects = vi.fn();
vi.mock("@/hooks/useAppProjects", () => ({
  useAppProjects: () => mockUseAppProjects(),
}));

describe("FirstAppOnboarding", () => {
  it("renderiza o título 'Comece aqui'", () => {
    mockUseAppProjects.mockReturnValue({ activeProject: null, openDrawer: vi.fn() });
    render(<FirstAppOnboarding />);
    expect(screen.getByText(/Comece aqui/i)).toBeInTheDocument();
  });

  it("sem app ativo, mostra 'Nenhum app ativo selecionado'", () => {
    mockUseAppProjects.mockReturnValue({ activeProject: null, openDrawer: vi.fn() });
    render(<FirstAppOnboarding />);
    expect(screen.getByText(/Para personalizar os prompts/i)).toBeInTheDocument();
  });

  it("com app ativo, mostra o nome do app ativo", () => {
    mockUseAppProjects.mockReturnValue({
      activeProject: { name: "Clube de Receitas" },
      openDrawer: vi.fn(),
    });
    render(<FirstAppOnboarding />);
    expect(screen.getByText(/App ativo:/i)).toBeInTheDocument();
    expect(screen.getByText(/Clube de Receitas/)).toBeInTheDocument();
  });

  it("diferencia Agente de Lovable na legenda", () => {
    mockUseAppProjects.mockReturnValue({ activeProject: null, openDrawer: vi.fn() });
    render(<FirstAppOnboarding />);
    expect(screen.getAllByText(/Planejar com o Agente/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Copiar para o Lovable/).length).toBeGreaterThan(0);
    expect(screen.getByText(/pensar antes de mexer/i)).toBeInTheDocument();
    expect(screen.getByText(/executar no app/i)).toBeInTheDocument();
  });
});
