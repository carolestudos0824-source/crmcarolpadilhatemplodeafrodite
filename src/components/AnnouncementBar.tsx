import { Link, useLocation } from "react-router-dom";
import { APP_CONFIG } from "@/config/appConfig";
import { useAuthState } from "@/hooks/useAuthState";

const SALES_ROUTES = ["/", "/precos", "/checkout", "/suporte"];

export const ANNOUNCEMENT_HEIGHT = 36;

export const AnnouncementBar = () => {
  const { pathname } = useLocation();
  const auth = useAuthState();

  if (!APP_CONFIG.SHOW_ANNOUNCEMENT_BAR) return null;

  // Logged-in user without active access → status reminder bar (everywhere except /login)
  if (
    auth.status === "authed" &&
    !auth.hasAccess &&
    !auth.isAdmin &&
    pathname !== "/login"
  ) {
    return (
      <div
        className="w-full shadow-md"
        style={{
          background: "linear-gradient(90deg, #1E88FF 0%, #00C2FF 100%)",
          color: "#F5F7FA",
        }}
      >
        <div className="container flex flex-wrap items-center justify-center md:justify-between gap-x-4 gap-y-1 py-2 text-center md:text-left">
          <p className="text-[12px] md:text-sm font-medium leading-tight">
            Seu login está ativo, mas seu acesso ainda não foi liberado.
          </p>
          <Link
            to="/entrega"
            className="text-[12px] md:text-sm font-semibold underline-offset-4 hover:underline whitespace-nowrap"
          >
            Ver status do acesso →
          </Link>
        </div>
      </div>
    );
  }

  // Logged-in user with active access (or admin): no promo bar
  if (auth.status === "authed" && (auth.hasAccess || auth.isAdmin)) {
    return null;
  }

  // Anonymous: promo bar only on sales-flow routes
  if (auth.status !== "authed" && !SALES_ROUTES.includes(pathname)) return null;

  // Loading: render nothing to avoid flicker
  if (auth.status === "loading") return null;

  return (
    <div
      className="w-full shadow-md"
      style={{
        background: "linear-gradient(90deg, #1E88FF 0%, #00C2FF 100%)",
        color: "#F5F7FA",
      }}
    >
      <div className="container flex flex-wrap items-center justify-center md:justify-between gap-x-4 gap-y-1 py-2 text-center md:text-left">
        <p className="text-[12px] md:text-sm font-medium leading-tight">
          {APP_CONFIG.ANNOUNCEMENT_TEXT}
        </p>
        <Link
          to={APP_CONFIG.ANNOUNCEMENT_CTA_LINK}
          className="text-[12px] md:text-sm font-semibold underline-offset-4 hover:underline whitespace-nowrap"
        >
          {APP_CONFIG.ANNOUNCEMENT_CTA_TEXT}
        </Link>
      </div>
    </div>
  );
};
