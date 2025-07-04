import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface ContratoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato?: any;
  onSave: (contrato: any) => void;
}

export default function ContratoModal({ open, onOpenChange, contrato, onSave }: ContratoModalProps) {
  const [dadosContrato, setDadosContrato] = useState({
    empresa: contrato?.empresa || "",
    fornecedor: contrato?.fornecedor || "",
    descricao: contrato?.descricao || "",
    valorContrato: contrato?.valorContrato || "",
    valorParcela: contrato?.valorParcela || "",
    numeroParcelas: contrato?.numeroParcelas || "",
    dataInicio: contrato?.dataInicio || "",
    diaVencimento: contrato?.diaVencimento || "",
    iniciarParcela: contrato?.iniciarParcela || "",
    numeroTitulo: contrato?.numeroTitulo || "",
    tipoMascara: contrato?.tipoMascara || "",
    planoContas: contrato?.planoContas || "",
    status: contrato?.status || "Ativo",
    observacoes: contrato?.observacoes || ""
  });

  const handleSave = () => {
    onSave(dadosContrato);
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setDadosContrato(prev => ({ ...prev, [field]: value }));
  };

  const gerarTitulos = () => {
    console.log("Gerando títulos para o contrato...");
    // Lógica para gerar títulos automaticamente
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editar Contrato {contrato ? `- ${contrato.numero || 'xxxxx'}` : '- Novo'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
            <TabsTrigger value="titulos">Títulos</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Empresa *</Label>
                <Select value={dadosContrato.empresa} onValueChange={(value) => handleInputChange('empresa', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BPrint">BPrint</SelectItem>
                    <SelectItem value="CL2G">CL2G</SelectItem>
                    <SelectItem value="Wingraph">Wingraph</SelectItem>
                    <SelectItem value="Bremen">Bremen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Fornecedor *</Label>
                <Select value={dadosContrato.fornecedor} onValueChange={(value) => handleInputChange('fornecedor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Energia SP">Energia SP</SelectItem>
                    <SelectItem value="Águas SA">Águas SA</SelectItem>
                    <SelectItem value="Tech Solutions">Tech Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Descrição *</Label>
              <Input
                value={dadosContrato.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descrição do contrato"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Valor do Contrato *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    className="pl-8"
                    value={dadosContrato.valorContrato}
                    onChange={(e) => handleInputChange('valorContrato', e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <Label>Valor da Parcela *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    className="pl-8"
                    value={dadosContrato.valorParcela}
                    onChange={(e) => handleInputChange('valorParcela', e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <Label>Nº de Parcelas *</Label>
                <Input
                  value={dadosContrato.numeroParcelas}
                  onChange={(e) => handleInputChange('numeroParcelas', e.target.value)}
                  placeholder="12"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Data de Início *</Label>
                <Input
                  type="date"
                  value={dadosContrato.dataInicio}
                  onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                />
              </div>

              <div>
                <Label>Dia do Vencimento *</Label>
                <Input
                  value={dadosContrato.diaVencimento}
                  onChange={(e) => handleInputChange('diaVencimento', e.target.value)}
                  placeholder="16"
                />
              </div>

              <div>
                <Label>Iniciar na Parcela *</Label>
                <Input
                  value={dadosContrato.iniciarParcela}
                  onChange={(e) => handleInputChange('iniciarParcela', e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Número do Título *</Label>
                <Input
                  value={dadosContrato.numeroTitulo}
                  onChange={(e) => handleInputChange('numeroTitulo', e.target.value)}
                  placeholder="xxxxx"
                />
              </div>

              <div>
                <Label>Tipo de Máscara *</Label>
                <Select value={dadosContrato.tipoMascara} onValueChange={(value) => handleInputChange('tipoMascara', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar máscara" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="titulo-parcela">Título - 99/99 - Título + parcela/total</SelectItem>
                    <SelectItem value="sequencial">Sequencial - 001, 002, 003...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {dadosContrato.tipoMascara && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Exemplo:</strong> {dadosContrato.numeroTitulo || 'xxxxx'} - 1/3
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plano de Contas</Label>
                <Select value={dadosContrato.planoContas} onValueChange={(value) => handleInputChange('planoContas', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Principal</SelectItem>
                    <SelectItem value="1.1">1.1 - Ativo</SelectItem>
                    <SelectItem value="2">2 - Resultado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status do Contrato</Label>
                <Select value={dadosContrato.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Observações</Label>
              <Textarea
                value={dadosContrato.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Observações sobre o contrato"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="titulos" className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Descrição:</p>
                  <p className="font-semibold">{dadosContrato.descricao || 'teste'}</p>
                  <p className="text-sm text-gray-600 mt-2">Valor do Contrato</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {dadosContrato.valorContrato || '22.222,00'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Saldo Devedor</p>
                  <p className="text-2xl font-bold text-red-500">R$ 0,00</p>
                  <p className="text-sm text-gray-600 mt-1">Contrato quitado</p>
                </div>
              </div>

              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum título encontrado</h3>
                <p className="text-gray-500 mb-6">Clique em "Gerar Títulos" para criar os títulos automaticamente.</p>
                <Button onClick={gerarTitulos} className="bg-green-600 hover:bg-green-700">
                  + Gerar Títulos
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Contrato
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}