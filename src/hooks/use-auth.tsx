import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  signIn: (email: string, key: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuração de Acesso
const AUTHORIZED_EMAIL = "carolestudos0824@gmail.com";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Usar localStorage para persistência de sessão solicitada (carol_crm_authenticated)
      const isAuthenticated = localStorage.getItem("carol_crm_authenticated") === "true";
      const storedUser = localStorage.getItem("templo_user");
      
      if (isAuthenticated && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Garantir limpeza se houver inconsistência
        localStorage.removeItem("carol_crm_authenticated");
        localStorage.removeItem("templo_user");
      }
    } catch (e) {
      console.error("Erro ao carregar sessão:", e);
      localStorage.removeItem("carol_crm_authenticated");
      localStorage.removeItem("templo_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, key: string) => {
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 800));

      const normalizedEmail = email.toLowerCase().trim();
      
      if (!normalizedEmail) {
        return { error: new Error("Digite seu e-mail de acesso.") };
      }

      if (!key.trim()) {
        return { error: new Error("Digite sua chave de acesso.") };
      }

      if (normalizedEmail !== AUTHORIZED_EMAIL) {
        return { error: new Error("Este e-mail não está autorizado para acessar o sistema.") };
      }

      // Validação da senha: Prioriza env var, se não existir usa fallback seguro solicitado
      // @ts-ignore - CRM_ACCESS_PASSWORD vem do ambiente
      const envPassword = import.meta.env.VITE_CRM_ACCESS_PASSWORD;
      const fallbackPassword = "Afrodite@2026";
      const securePassword = envPassword || fallbackPassword;
      
      if (key.trim() !== securePassword) {
        return { error: new Error("Chave de acesso incorreta.") };
      }

      const userData = { email: normalizedEmail };
      setUser(userData);
      localStorage.setItem("carol_crm_authenticated", "true");
      localStorage.setItem("templo_user", JSON.stringify(userData));
      
      return { error: null };
    } catch (e) {
      console.error("Login Error:", e);
      return { error: new Error("Não foi possível entrar agora. Verifique os dados e tente novamente.") };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("carol_crm_authenticated");
    localStorage.removeItem("templo_user");
    // Removendo outros possíveis estados em memória que podem persistir via cache ou estado de componentes
    // mas o principal é o localStorage para redirecionamento
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
