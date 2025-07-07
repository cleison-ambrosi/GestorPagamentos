import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [search, setSearch] = useState(initialSearch);
  const [filteredPlanoContas, setFilteredPlanoContas] = useState(planoContas);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPlanoContas(planoContas);
    } else {
      const filtered = planoContas.filter(conta =>
        conta.nome.toLowerCase().includes(search.toLowerCase()) ||
        conta.codigo.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPlanoContas(filtered);
    }
  }, [search, planoContas]);

  useEffect(() => {
    if (open) {
      setSearch(initialSearch);
    }
  }, [open, initialSearch]);

  const handleSelect = (conta: any) => {
    onSelect(conta);
    onOpenChange(false);
  };

  const handleClear = () => {
    onSelect({ id: "", nome: "", codigo: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Selecionar Conta Pai</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar por nome ou código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button variant="outline" onClick={handleClear}>
              Limpar Seleção
            </Button>
          </div>

          <div className="border rounded-md max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sel.</TableHead>
                  <TableHead className="w-24">ID</TableHead>
                  <TableHead className="w-32">Código</TableHead>
                  <TableHead>Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlanoContas.map((conta) => (
                  <TableRow 
                    key={conta.id} 
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSelect(conta)}
                  >
                    <TableCell className="text-center">
                      {selectedId === conta.id.toString() && (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {String(conta.id).padStart(2, '0')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {conta.codigo}
                    </TableCell>
                    <TableCell>{conta.nome}</TableCell>
                  </TableRow>
                ))}
                {filteredPlanoContas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      Nenhuma conta encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}