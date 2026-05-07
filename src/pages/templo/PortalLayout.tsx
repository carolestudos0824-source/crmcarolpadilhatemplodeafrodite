import React from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Home, 
  Send, 
  ClipboardList, 
  MessageSquare, 
  ChevronLeft,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const portalNavItems = [
  { icon: Home, label: "Início", path: "/portal" },
  { icon: Send, label: "Novo Caso", path: "/portal/novo-atendimento" },
  { icon: ClipboardList, label: "Acompanhar", path: "/portal/acompanhar" },
  { icon: MessageSquare, label: "Mensagens", path: "/portal/mensagens" },
];

export function PortalLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F4F0EA] pb-24 lg:pb-0">
      {/* Header Portal */}
      <header className="bg-white border-b border-[#C9A35A]/10 py-6 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <Link to="/portal" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#A61E25] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#A61E25]/20 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-sm font-display italic text-[#111111]">Portal da Cliente</h1>
            <p className="text-[9px] uppercase tracking-widest font-bold text-[#C9A35A]">Carol Padilha</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2">
          {portalNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest",
                  isActive 
                    ? "bg-[#A61E25] text-white shadow-md shadow-[#A61E25]/10" 
                    : "text-[#111111]/40 hover:text-[#A61E25] hover:bg-[#A61E25]/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
        <Outlet />
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-[#C9A35A]/10 flex items-center justify-around p-3 z-50 lg:hidden rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {portalNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                isActive ? "text-[#A61E25]" : "text-[#111111]/30"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "text-[#A61E25]" : "text-inherit")} />
              <span className="text-[10px] uppercase tracking-wider font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
