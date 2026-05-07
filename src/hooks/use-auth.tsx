import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  signIn: (email: string, key: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciais internas temporárias
const AUTHORIZED_EMAIL = "carolestudos0824@gmail.com";
const INTERNAL_ACCESS_KEY = "Afrodite@2026"; // Chave interna para a fase de desenvolvimento

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Manter sessão enquanto o navegador estiver aberto (sessionStorage)
      const storedUser = sessionStorage.getItem("templo_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Erro ao carregar sessão:", e);
      sessionStorage.removeItem("templo_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, key: string) => {
    try {
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!email || !key) {
        return { error: new Error("Preencha todos os campos.") };
      }

      if (email.toLowerCase().trim() !== AUTHORIZED_EMAIL.toLowerCase()) {
        return { error: new Error("E-mail não autorizado para este sistema.") };
      }

      if (key.trim() !== INTERNAL_ACCESS_KEY) {
        return { error: new Error("Chave de acesso incorreta.") };
      }

      const userData = { email: email.toLowerCase().trim() };
      setUser(userData);
      sessionStorage.setItem("templo_user", JSON.stringify(userData));
      
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error("Erro inesperado ao entrar.") };
    }
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
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
