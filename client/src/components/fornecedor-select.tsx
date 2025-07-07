import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FornecedorSearchModal from "./fornecedor-search-modal";

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
  placeholder = "Clique para pesquisar fornecedor",
}: FornecedorSelectProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectedFornecedor = fornecedores.find(f => f.id.toString() === value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.length > 0) {
      setModalOpen(true);
    }
  };

  const handleInputFocus = () => {
    setModalOpen(true);
  };

  const handleSearchClick = () => {
    setModalOpen(true);
  };

  const handleFornecedorSelect = (fornecedor: any) => {
    onValueChange(fornecedor.id.toString());
    setInputValue("");
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder={selectedFornecedor ? selectedFornecedor.nome : placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={`pr-10 ${selectedFornecedor 
              ? 'text-black placeholder:text-black' 
              : 'text-slate-500 placeholder:text-slate-500'
            }`}
            readOnly={false}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSearchClick}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FornecedorSearchModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        fornecedores={fornecedores}
        onSelect={handleFornecedorSelect}
        selectedId={value}
        initialSearch={inputValue}
      />
    </div>
  );
}