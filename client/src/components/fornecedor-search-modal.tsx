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

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {filteredFornecedores.map((fornecedor) => (
                  <button
                    key={fornecedor.id}
                    onClick={() => handleSelect(fornecedor)}
                    className="w-full p-4 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium">{fornecedor.nome}</div>
                      {fornecedor.email && (
                        <div className="text-sm text-slate-500">{fornecedor.email}</div>
                      )}
                      {fornecedor.telefone && (
                        <div className="text-sm text-slate-500">{fornecedor.telefone}</div>
                      )}
                    </div>
                    {selectedId === fornecedor.id.toString() && (
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