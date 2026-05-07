import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  signIn: (email: string, key: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciais internas temporárias
const AUTHORIZED_EMAIL = "carolestudos0824@gmail.com";
const INTERNAL_ACCESS_KEY = "templo2024"; // Chave interna para a versão privada

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Manter sessão enquanto o navegador estiver aberto (sessionStorage)
    const storedUser = sessionStorage.getItem("templo_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, key: string) => {
    // Simular delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email !== AUTHORIZED_EMAIL) {
      return { error: new Error("E-mail não autorizado para este sistema.") };
    }

    if (key !== INTERNAL_ACCESS_KEY) {
      return { error: new Error("Chave de acesso incorreta.") };
    }

    const userData = { email };
    setUser(userData);
    sessionStorage.setItem("templo_user", JSON.stringify(userData));
    
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    sessionStorage.removeItem("templo_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
