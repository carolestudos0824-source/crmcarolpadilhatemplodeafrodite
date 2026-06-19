import { Link, useLocation } from "react-router-dom";
import { APP_CONFIG } from "@/config/appConfig";

const ALLOWED = ["/", "/precos", "/checkout", "/suporte"];

export const ANNOUNCEMENT_HEIGHT = 36; // px (approx) used for spacing

export const AnnouncementBar = () => {
  const { pathname } = useLocation();
  if (!APP_CONFIG.SHOW_ANNOUNCEMENT_BAR) return null;
  if (!ALLOWED.includes(pathname)) return null;

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
