import { useState, useMemo } from "react";
import { Search, Eye, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { EDITORIAL_REGISTRY, validateArcano } from "@/data/arcanos/index";
import type { ArcanoMaiorEditorial } from "@/data/arcano-editorial";

type FilterType = "all" | "complete" | "partial" | "empty";

function getCompletionStatus(arcano: ArcanoMaiorEditorial) {
  const errors = validateArcano(arcano);
  if (errors.length === 0) return "complete" as const;

  // Check if it has substantial content beyond just metadata
  const hasEssence = !!arcano.essence?.trim();
  const hasVoice = !!arcano.voice?.fullText?.trim();
  const hasSymbols = arcano.symbols?.length > 0;
  const hasQuiz = arcano.quiz?.length > 0;

  if (hasEssence || hasVoice || hasSymbols || hasQuiz) return "partial" as const;
  return "empty" as const;
}

function getStatusLabel(status: "complete" | "partial" | "empty") {
  switch (status) {
    case "complete": return "Publicado";
    case "partial": return "Parcial";
    case "empty": return "Rascunho";
  }
}

function getStatusIcon(status: "complete" | "partial" | "empty") {
  switch (status) {
    case "complete": return <CheckCircle2 className="w-3.5 h-3.5 text-primary" />;
    case "partial": return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
    case "empty": return <MinusCircle className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

function getStatusBadgeClass(status: "complete" | "partial" | "empty") {
  switch (status) {
    case "complete": return "bg-primary/10 text-primary border-primary/20";
    case "partial": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "empty": return "bg-muted text-muted-foreground border-border";
  }
}

// Field completeness checker for the detail view
function getFieldStatus(value: unknown): "filled" | "empty" {
  if (value === null || value === undefined) return "empty";
  if (typeof value === "string") return value.trim() ? "filled" : "empty";
  if (Array.isArray(value)) return value.length > 0 ? "filled" : "empty";
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(v =>
      typeof v === "string" ? v.trim() : !!v
    ) ? "filled" : "empty";
  }
  return "filled";
}

interface FieldDisplayProps {
  label: string;
  value: unknown;
  type?: "text" | "array" | "object" | "interpretations" | "voice" | "deepdive" | "questions" | "quiz" | "review";
}

const FieldDisplay = ({ label, value, type = "text" }: FieldDisplayProps) => {
  const status = getFieldStatus(value);
  const isEmpty = status === "empty";

  return (
    <div className="py-3">
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${isEmpty ? "bg-muted-foreground/40" : "bg-primary"}`} />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>

      {isEmpty ? (
        <p className="text-sm text-muted-foreground/50 italic ml-3.5">Campo vazio — aguardando conteúdo</p>
      ) : type === "text" ? (
        <p className="text-sm text-foreground/90 ml-3.5 leading-relaxed whitespace-pre-wrap">{String(value)}</p>
      ) : type === "array" ? (
        <div className="flex flex-wrap gap-1.5 ml-3.5">
          {(value as string[]).map((item, i) => (
            <Badge key={i} variant="outline" className="text-xs">{item}</Badge>
          ))}
        </div>
      ) : type === "object" ? (
        <div className="space-y-2 ml-3.5">
          {(value as { name: string; meaning: string }[]).map((sym, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium text-foreground">{sym.name}</span>
              <span className="text-muted-foreground"> — {sym.meaning}</span>
            </div>
          ))}
        </div>
      ) : type === "interpretations" ? (
        <div className="ml-3.5 space-y-1">
          <p className="text-sm"><span className="text-primary font-medium">☀ Luz:</span> <span className="text-foreground/90">{(value as { light: string; shadow: string }).light || "—"}</span></p>
          <p className="text-sm"><span className="text-amber-500 font-medium">☾ Sombra:</span> <span className="text-foreground/90">{(value as { light: string; shadow: string }).shadow || "—"}</span></p>
        </div>
      ) : type === "voice" ? (
        <div className="ml-3.5 space-y-2">
          <p className="text-sm italic text-foreground/80">"{(value as { intro: string; fullText: string }).intro}"</p>
          <p className="text-sm text-foreground/70 leading-relaxed">{(value as { intro: string; fullText: string }).fullText}</p>
        </div>
      ) : type === "deepdive" ? (
        <div className="ml-3.5 space-y-2">
          {Object.entries(value as Record<string, string>).map(([key, text]) => (
            <div key={key}>
              <span className="text-xs font-medium text-muted-foreground capitalize">{key === "text" ? "Texto principal" : key === "symbolism" ? "Simbolismo" : key === "cabala" ? "Cabala" : "História"}:</span>
              <p className="text-sm text-foreground/90">{text || <span className="italic text-muted-foreground/50">Vazio</span>}</p>
            </div>
          ))}
        </div>
      ) : type === "questions" ? (
        <ol className="ml-3.5 space-y-1 list-decimal list-inside">
          {(value as { question: string }[]).map((q, i) => (
            <li key={i} className="text-sm text-foreground/90">{q.question}</li>
          ))}
        </ol>
      ) : type === "quiz" ? (
        <div className="ml-3.5 space-y-2">
          {(value as { question: string; options: string[]; correctIndex: number }[]).map((q, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium text-foreground">{i + 1}. {q.question}</p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {q.options.map((opt, j) => (
                  <Badge key={j} variant={j === q.correctIndex ? "default" : "outline"} className="text-[10px]">{opt}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : type === "review" ? (
        <div className="ml-3.5 grid gap-1">
          {(value as { keyword: string; meaning: string }[]).map((r, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium text-foreground">{r.keyword}</span>
              <span className="text-muted-foreground"> → {r.meaning}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const AdminArcanos = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const arcanoList = useMemo(() => {
    return Object.values(EDITORIAL_REGISTRY).map(arcano => ({
      ...arcano,
      status: getCompletionStatus(arcano),
      errorCount: validateArcano(arcano).length,
      errors: validateArcano(arcano),
    }));
  }, []);

  const filtered = arcanoList.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && a.status === filter;
  });

  const stats = useMemo(() => ({
    complete: arcanoList.filter(a => a.status === "complete").length,
    partial: arcanoList.filter(a => a.status === "partial").length,
    empty: arcanoList.filter(a => a.status === "empty").length,
  }), [arcanoList]);

  const selected = selectedNumber !== null ? EDITORIAL_REGISTRY[selectedNumber] : null;
  const selectedMeta = selectedNumber !== null ? arcanoList.find(a => a.number === selectedNumber) : null;

  // Count filled fields for the selected arcano
  const fieldCount = selected ? (() => {
    const fields = [
      selected.essence, selected.archetype, selected.light, selected.shadow,
      selected.initiationLesson, selected.symbols, selected.keywords,
      selected.love, selected.work, selected.spirituality,
      selected.voice, selected.deepDive, selected.reflectionQuestions,
      selected.quiz, selected.quickReview,
    ];
    const filled = fields.filter(f => getFieldStatus(f) === "filled").length;
    return { filled, total: fields.length };
  })() : null;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div>
        <h2 className="font-heading text-lg text-foreground">Arcanos Maiores — Editorial</h2>
        <div className="flex gap-4 mt-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-primary" /> {stats.complete} completos
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" /> {stats.partial} parciais
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MinusCircle className="w-3 h-3" /> {stats.empty} rascunhos
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar arcano..."
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={v => setFilter(v as FilterType)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos ({arcanoList.length})</SelectItem>
            <SelectItem value="complete">Completos ({stats.complete})</SelectItem>
            <SelectItem value="partial">Parciais ({stats.partial})</SelectItem>
            <SelectItem value="empty">Rascunhos ({stats.empty})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="grid gap-2">
        {filtered.map(arcano => (
          <button
            key={arcano.number}
            onClick={() => setSelectedNumber(arcano.number)}
            className="w-full flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group text-left"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-heading text-sm text-primary shrink-0">
              {arcano.numeral}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground">{arcano.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{arcano.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              {arcano.errorCount > 0 && (
                <span className="text-[10px] text-muted-foreground">{arcano.errorCount} pendência{arcano.errorCount > 1 ? "s" : ""}</span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 ${getStatusBadgeClass(arcano.status)}`}>
                {getStatusIcon(arcano.status)}
                {getStatusLabel(arcano.status)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={selectedNumber !== null} onOpenChange={() => setSelectedNumber(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
          {selected && selectedMeta && (
            <>
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="font-heading text-xl flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">
                        {selected.numeral}
                      </span>
                      {selected.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selected.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border inline-flex items-center gap-1 ${getStatusBadgeClass(selectedMeta.status)}`}>
                      {getStatusIcon(selectedMeta.status)}
                      {getStatusLabel(selectedMeta.status)}
                    </span>
                    {fieldCount && (
                      <p className="text-[10px] text-muted-foreground mt-1">{fieldCount.filled}/{fieldCount.total} campos preenchidos</p>
                    )}
                  </div>
                </div>

                {/* Error list */}
                {selectedMeta.errors.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <p className="text-xs font-medium text-destructive mb-1">Pendências ({selectedMeta.errors.length}):</p>
                    <ul className="space-y-0.5">
                      {selectedMeta.errors.map((err, i) => (
                        <li key={i} className="text-[11px] text-destructive/80">• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </DialogHeader>

              <Separator />

              <ScrollArea className="flex-1 max-h-[60vh]">
                <div className="p-6 space-y-1 divide-y divide-border/30">
                  <FieldDisplay label="Essência" value={selected.essence} />
                  <FieldDisplay label="Palavras-chave" value={selected.keywords} type="array" />
                  <FieldDisplay label="Símbolos centrais" value={selected.symbols} type="object" />
                  <FieldDisplay label="Arquétipo" value={selected.archetype} />
                  <FieldDisplay label="Luz" value={selected.light} />
                  <FieldDisplay label="Sombra" value={selected.shadow} />
                  <FieldDisplay label="Lição iniciática" value={selected.initiationLesson} />
                  <FieldDisplay label="No amor" value={selected.love} type="interpretations" />
                  <FieldDisplay label="No trabalho" value={selected.work} type="interpretations" />
                  <FieldDisplay label="Na espiritualidade" value={selected.spirituality} type="interpretations" />
                  <FieldDisplay label="Voz do arcano" value={selected.voice} type="voice" />
                  <FieldDisplay label="Aprofundamento" value={selected.deepDive} type="deepdive" />
                  <FieldDisplay label="Perguntas de reflexão" value={selected.reflectionQuestions} type="questions" />
                  <FieldDisplay label="Quiz" value={selected.quiz} type="quiz" />
                  <FieldDisplay label="Revisão rápida" value={selected.quickReview} type="review" />
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArcanos;
