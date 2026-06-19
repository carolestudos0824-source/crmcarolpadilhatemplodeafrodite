import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initFontScale } from "./components/FontSizeControl";

initFontScale();

// One-time cleanup of the legacy "demo session" mirror key.
// Supabase Auth is the single source of truth; this key is no longer read
// anywhere, but old browsers may still have it. Safe no-op if absent.
try {
  localStorage.removeItem("fabrica_apps_session");
} catch {
  /* noop */
}

createRoot(document.getElementById("root")!).render(<App />);
