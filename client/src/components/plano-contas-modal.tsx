import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { PlanoContas } from "@shared/schema";

interface PlanoContasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conta?: PlanoContas;
  onSave: (conta: any) => void;
}

export default function PlanoContasModal({ open, onOpenChange, conta, onSave }: PlanoContasModalProps) {
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [contaPai, setContaPai] = useState("");

  const { data: planoContas } = useQuery<PlanoContas[]>({
    queryKey: ["/api/plano-contas"],
    enabled: open,
  });

  useEffect(() => {
    if (conta) {
      setCodigo(conta.codigo);
      setNome(conta.nome);
      setContaPai(conta.idContaPai?.toString() || "");
    } else {
      setCodigo("");
      setNome("");
      setContaPai("");
    }
  }, [conta, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contaData = {
      codigo,
      nome,
      idContaPai: contaPai && contaPai !== "0" ? parseInt(contaPai) : null,
    };

    onSave(contaData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {conta ? "Editar Conta" : "Nova Conta"}
          </DialogTitle>
          <DialogDescription>
            {conta ? "Editar informações da conta" : "Criar uma nova conta no plano de contas"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: 1.1.01"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da conta"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contaPai">Conta Pai</Label>
            <Select value={contaPai} onValueChange={setContaPai}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta pai (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Nenhuma (Conta raiz)</SelectItem>
                {planoContas?.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.codigo} - {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {conta ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}