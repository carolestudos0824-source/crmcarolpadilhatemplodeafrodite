import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  title?: string;
  message?: string;
  backTo?: string;
  backLabel?: string;
}

/**
 * Estado vazio universal — usado pelo adapter quando uma chave de conteúdo
 * não existe nem no banco nem no legado.
 */
export const ContentNotFound = ({
  title = "Conteúdo não encontrado",
  message = "Este conteúdo ainda não está disponível ou pode ter sido movido.",
  backTo = "/",
  backLabel = "Voltar ao início",
}: Props) => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" onClick={() => navigate(backTo)}>
        {backLabel}
      </Button>
    </div>
  );
};
