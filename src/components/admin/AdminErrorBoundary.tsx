import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type Props = {
  /** Identifier used to reset the boundary when the active section changes. */
  resetKey?: string | number;
  variant?: "section" | "route";
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Local error boundary for the admin panel. Prevents a single section crash
 * from blanking the whole `/admin/acessos` page.
 */
export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // Keep the original error visible in the console for debugging.
    // eslint-disable-next-line no-console
    console.error("[AdminErrorBoundary] section crashed:", error, info);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  private retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.variant === "route") {
      return (
        <AdminRouteErrorFallback
          error={this.state.error}
          onRetry={this.retry}
        />
      );
    }

    return (
      <div className="admin-card">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-300 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-semibold text-sm mb-1">
              Erro ao carregar esta seção do painel admin.
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Algo quebrou nesta área, mas o restante do painel continua funcionando.
              Tente novamente ou abra outra seção pelo menu.
            </p>
            {this.state.error?.message && (
              <pre className="text-[11px] text-red-200/80 bg-red-500/10 border border-red-500/20 rounded-lg p-2 mb-3 whitespace-pre-wrap break-words">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.retry}
              className="btn-ghost border border-white/15 text-xs"
            >
              <RefreshCw size={14} /> Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export function AdminRouteErrorFallback({
  error,
  onRetry,
}: {
  error?: Error | null;
  onRetry?: () => void;
}) {
  const showDebug = import.meta.env.DEV || window.location.hostname.includes("lovable.app");

  return (
    <div className="min-h-screen bg-[#05070D] text-foreground flex items-center justify-center px-4">
      <div className="max-w-lg w-full admin-card p-8">
        <AlertTriangle className="text-amber-300 mb-4" size={30} />
        <h1 className="text-xl font-heading font-bold mb-2">
          Não foi possível carregar o painel admin
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          O painel encontrou um erro ao carregar esta seção. Tente atualizar ou voltar para a Visão geral.
        </p>
        {showDebug && error?.message && (
          <pre className="text-[11px] text-red-200/80 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-5 whitespace-pre-wrap break-words">
            {error.message}
          </pre>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={onRetry ?? (() => window.location.reload())} className="btn-primary">
            <RefreshCw size={14} /> Tentar novamente
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/admin/acessos?section=overview")}
            className="btn-ghost border border-white/15"
          >
            Ir para Visão geral
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/entrega")}
            className="btn-ghost border border-white/15"
          >
            Minha área
          </button>
        </div>
      </div>
    </div>
  );
}
