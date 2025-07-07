import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FornecedorSelectProps {
  fornecedores: any[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export default function FornecedorSelect({
  fornecedores,
  value,
  onValueChange,
  placeholder = "Selecione um fornecedor..."
}: FornecedorSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFornecedor = fornecedores.find(f => f.id.toString() === value);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 p-2 border rounded-md bg-white">
        <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
        <Input
          placeholder="Buscar e selecionar fornecedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0 flex-1"
        />
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-auto border-0 h-auto p-0 bg-transparent focus:ring-0">
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {filteredFornecedores.length === 0 ? (
              <div className="px-2 py-3 text-sm text-slate-500">
                Nenhum fornecedor encontrado
              </div>
            ) : (
              filteredFornecedores.map((fornecedor) => (
                <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                  {fornecedor.nome}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      {selectedFornecedor && (
        <div className="mt-1 text-sm text-slate-600">
          Selecionado: {selectedFornecedor.nome}
        </div>
      )}
    </div>
  );
}