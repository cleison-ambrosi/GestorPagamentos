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
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar fornecedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex-1">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
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
    </div>
  );
}