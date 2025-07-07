import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";

interface PlanoContasSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planoContas: any[];
  onSelect: (planoContas: any) => void;
  selectedId?: string;
  initialSearch?: string;
}

export default function PlanoContasSearchModal({
  open,
  onOpenChange,
  planoContas,
  onSelect,
  selectedId,
  initialSearch = ""
}: PlanoContasSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open && initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [open, initialSearch]);

  const filteredPlanoContas = planoContas.filter(conta => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    const codigo = conta.codigo?.toLowerCase() || '';
    const nome = conta.nome?.toLowerCase() || '';
    const descricao = conta.descricao?.toLowerCase() || '';
    
    return codigo.includes(term) || nome.includes(term) || descricao.includes(term);
  });

  const handleSelect = (conta: any) => {
    onSelect(conta);
    onOpenChange(false);
  };

  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span> : 
        part
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pesquisar Plano de Contas</DialogTitle>
          <DialogDescription>
            Digite para pesquisar e selecionar uma conta pelo código, nome ou descrição.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Digite o código, nome ou descrição da conta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-auto border rounded-lg">
            {filteredPlanoContas.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                {searchTerm ? "Nenhuma conta encontrada" : "Digite para pesquisar contas"}
              </div>
            ) : (
              <div className="divide-y">
                {filteredPlanoContas.map((conta) => (
                  <button
                    key={conta.id}
                    onClick={() => handleSelect(conta)}
                    className="w-full p-4 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium">
                        {highlightText(conta.codigo, searchTerm)} - {highlightText(conta.nome, searchTerm)}
                      </div>
                      {conta.descricao && (
                        <div className="text-sm text-slate-500">
                          {highlightText(conta.descricao, searchTerm)}
                        </div>
                      )}
                    </div>
                    {selectedId === conta.id.toString() && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}