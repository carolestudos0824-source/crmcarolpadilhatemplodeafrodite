import { describe, it, expect } from "vitest";
import { pickAutoActive, type AppProject } from "./useAppProjects";

const mk = (over: Partial<AppProject>): AppProject => ({
  id: "x",
  name: "x",
  status: "ideia",
  currentModuleId: null,
  completedModuleIds: [],
  context: {} as AppProject["context"],
  archivedAt: null,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  ...over,
});

describe("pickAutoActive", () => {
  it("returns null when list is empty", () => {
    expect(pickAutoActive([])).toBeNull();
  });

  it("returns the only project when list has 1", () => {
    const p = mk({ id: "a", name: "Clube de Receitas" });
    expect(pickAutoActive([p])?.name).toBe("Clube de Receitas");
  });

  it("picks the most recent by updatedAt", () => {
    const a = mk({ id: "a", name: "old", updatedAt: "2025-01-01T00:00:00Z" });
    const b = mk({ id: "b", name: "new", updatedAt: "2025-06-01T00:00:00Z" });
    expect(pickAutoActive([a, b])?.name).toBe("new");
  });

  it("falls back to createdAt when updatedAt missing", () => {
    const a = mk({ id: "a", name: "old", updatedAt: "", createdAt: "2025-01-01T00:00:00Z" });
    const b = mk({ id: "b", name: "new", updatedAt: "", createdAt: "2025-06-01T00:00:00Z" });
    expect(pickAutoActive([a, b])?.name).toBe("new");
  });

  it("prefers non-archived over archived", () => {
    const a = mk({ id: "a", name: "archived", archivedAt: "2025-06-01T00:00:00Z", updatedAt: "2025-06-01T00:00:00Z" });
    const b = mk({ id: "b", name: "active", updatedAt: "2025-01-01T00:00:00Z" });
    expect(pickAutoActive([a, b])?.name).toBe("active");
  });
});
