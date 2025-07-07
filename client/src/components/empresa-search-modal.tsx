import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";

interface EmpresaSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresas: any[];
  onSelect: (empresa: any) => void;
  selectedId?: string;
  initialSearch?: string;
}

export default function EmpresaSearchModal({
  open,
  onOpenChange,
  empresas,
  onSelect,
  selectedId,
  initialSearch = ""
}: EmpresaSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open && initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [open, initialSearch]);

  const filteredEmpresas = empresas.filter(empresa => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    const nome = empresa.nome?.toLowerCase() || '';
    const apelido = empresa.apelido?.toLowerCase() || '';
    const cnpj = empresa.cnpj?.toLowerCase() || '';
    
    return nome.includes(term) || apelido.includes(term) || cnpj.includes(term);
  });

  const handleSelect = (empresa: any) => {
    onSelect(empresa);
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
          <DialogTitle>Pesquisar Empresa</DialogTitle>
          <DialogDescription>
            Digite para pesquisar e selecionar uma empresa pelo nome, apelido ou CNPJ.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Digite o nome, apelido ou CNPJ da empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-auto border rounded-lg">
            {filteredEmpresas.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                {searchTerm ? "Nenhuma empresa encontrada" : "Digite para pesquisar empresas"}
              </div>
            ) : (
              <div className="divide-y">
                {filteredEmpresas.map((empresa) => (
                  <button
                    key={empresa.id}
                    onClick={() => handleSelect(empresa)}
                    className="w-full p-4 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium">
                        {highlightText(empresa.nome, searchTerm)}
                      </div>
                      {empresa.apelido && (
                        <div className="text-sm text-slate-600">
                          Apelido: {highlightText(empresa.apelido, searchTerm)}
                        </div>
                      )}
                      {empresa.cnpj && (
                        <div className="text-sm text-slate-500">
                          CNPJ: {highlightText(empresa.cnpj, searchTerm)}
                        </div>
                      )}
                    </div>
                    {selectedId === empresa.id.toString() && (
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