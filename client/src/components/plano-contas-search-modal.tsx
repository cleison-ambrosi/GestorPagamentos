import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Check } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filteredPlanoContas, setFilteredPlanoContas] = useState(planoContas);

  useEffect(() => {
    if (open) {
      setSearchTerm(initialSearch);
    }
  }, [open, initialSearch]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlanoContas(planoContas);
    } else {
      const filtered = planoContas.filter(conta =>
        conta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conta.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlanoContas(filtered);
    }
  }, [searchTerm, planoContas]);

  const handleSelect = (conta: any) => {
    onSelect(conta);
    onOpenChange(false);
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Selecionar Plano de Contas</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="border rounded-md max-h-96 overflow-y-auto">
            <div className="space-y-1 p-2">
              {filteredPlanoContas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum plano de contas encontrado
                </div>
              ) : (
                filteredPlanoContas.map((conta) => (
                  <button
                    key={conta.id}
                    onClick={() => handleSelect(conta)}
                    className={`w-full text-left p-3 rounded-md border transition-colors hover:bg-gray-50 ${
                      selectedId === conta.id.toString() ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {highlightText(conta.codigo, searchTerm)} - {highlightText(conta.nome, searchTerm)}
                        </div>
                        {conta.descricao && (
                          <div className="text-sm text-gray-500 mt-1">
                            {highlightText(conta.descricao, searchTerm)}
                          </div>
                        )}
                      </div>
                      {selectedId === conta.id.toString() && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}