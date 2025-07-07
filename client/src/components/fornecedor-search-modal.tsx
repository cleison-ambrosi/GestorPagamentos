import { useState, useEffect } from "react";
import { Search, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FornecedorSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedores: any[];
  onSelect: (fornecedor: any) => void;
  selectedId?: string;
  initialSearch?: string;
}

export default function FornecedorSearchModal({
  open,
  onOpenChange,
  fornecedores,
  onSelect,
  selectedId,
  initialSearch = ""
}: FornecedorSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Update search when modal opens with initial search value
  useEffect(() => {
    if (open) {
      setSearchTerm(initialSearch);
    }
  }, [open, initialSearch]);

  const filteredFornecedores = fornecedores.filter(fornecedor => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    const nome = fornecedor.nome?.toLowerCase() || '';
    const email = fornecedor.email?.toLowerCase() || '';
    const telefone = fornecedor.telefone?.toLowerCase() || '';
    
    // Busca por qualquer parte do texto em nome, email ou telefone
    return nome.includes(term) || 
           email.includes(term) || 
           telefone.includes(term);
  });

  const handleSelect = (fornecedor: any) => {
    onSelect(fornecedor);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pesquisar Fornecedor</DialogTitle>
          <DialogDescription>
            Digite para pesquisar e selecionar um fornecedor pelo nome ou email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Digite o nome ou email do fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto border rounded-lg">
            {filteredFornecedores.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                {searchTerm ? "Nenhum fornecedor encontrado" : "Digite para pesquisar fornecedores"}
              </div>
            ) : (
              <div className="divide-y">
                {filteredFornecedores.map((fornecedor) => {
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
                    <button
                      key={fornecedor.id}
                      onClick={() => handleSelect(fornecedor)}
                      className="w-full p-4 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-medium">
                          {highlightText(fornecedor.nome, searchTerm)}
                        </div>
                        {fornecedor.email && (
                          <div className="text-sm text-slate-500">
                            {highlightText(fornecedor.email, searchTerm)}
                          </div>
                        )}
                        {fornecedor.telefone && (
                          <div className="text-sm text-slate-500">
                            {highlightText(fornecedor.telefone, searchTerm)}
                          </div>
                        )}
                      </div>
                      {selectedId === fornecedor.id.toString() && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}