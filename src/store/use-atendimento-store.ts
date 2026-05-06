import { create } from "zustand";

interface CartaPosicao {
  carta: string;
  tipo: "Arcano Maior" | "Arcano Menor";
  naipe?: "Copas" | "Ouros" | "Espadas" | "Paus";
  orientacao: "Normal" | "Invertida";
  observacao: string;
}

interface AtendimentoState {
  clienteId: string | null;
  situacao: string;
  relato: string;
  cartas: Record<number, CartaPosicao>;
  leituraGerada: string;
  textoWhatsApp: string;
  
  setClienteId: (id: string | null) => void;
  setSituacao: (situacao: string) => void;
  setRelato: (relato: string) => void;
  setCarta: (posicao: number, dados: CartaPosicao) => void;
  setLeituraGerada: (texto: string) => void;
  setTextoWhatsApp: (texto: string) => void;
  reset: () => void;
}

export const useAtendimentoStore = create<AtendimentoState>((set) => ({
  clienteId: null,
  situacao: "",
  relato: "",
  cartas: {},
  leituraGerada: "",
  textoWhatsApp: "",

  setClienteId: (clienteId) => set({ clienteId }),
  setSituacao: (situacao) => set({ situacao }),
  setRelato: (relato) => set({ relato }),
  setCarta: (posicao, dados) => set((state) => ({
    cartas: { ...state.cartas, [posicao]: dados }
  })),
  setLeituraGerada: (leituraGerada) => set({ leituraGerada }),
  setTextoWhatsApp: (textoWhatsApp) => set({ textoWhatsApp }),
  reset: () => set({ 
    clienteId: null, 
    situacao: "", 
    relato: "", 
    cartas: {}, 
    leituraGerada: "", 
    textoWhatsApp: "" 
  }),
}));
