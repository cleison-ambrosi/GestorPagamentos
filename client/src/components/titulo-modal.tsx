import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface TituloModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo?: any;
  onSave: (titulo: any) => void;
}

export default function TituloModal({ open, onOpenChange, titulo, onSave }: TituloModalProps) {
  const [dadosTitulo, setDadosTitulo] = useState({
    idEmpresa: titulo?.idEmpresa || "1",
    idFornecedor: titulo?.idFornecedor || "1",
    numeroTitulo: titulo?.numeroTitulo || "",
    emissao: titulo?.emissao ? titulo.emissao.split('T')[0] : new Date().toISOString().split('T')[0],
    vencimento: titulo?.vencimento || "",
    valorTotal: titulo?.valorTotal?.toString() || "0.00",
    saldoPagar: titulo?.saldoPagar?.toString() || "0.00",
    idPlanoContas: titulo?.idPlanoContas || "1",
    descricao: titulo?.descricao || "",
    observacoes: titulo?.observacoes || ""
  });

  const [dadosBaixa, setDadosBaixa] = useState({
    dataBaixa: new Date().toISOString().split('T')[0],
    valorBaixa: dadosTitulo.saldoPagar || "",
    juros: "0,00",
    desconto: "0,00",
    valorPago: dadosTitulo.saldoPagar || "",
    observacao: ""
  });

  const handleSave = () => {
    // Converter string values para o formato correto do backend
    const tituloData = {
      ...dadosTitulo,
      idEmpresa: parseInt(dadosTitulo.idEmpresa) || 1,
      idFornecedor: parseInt(dadosTitulo.idFornecedor) || 1,
      idPlanoContas: parseInt(dadosTitulo.idPlanoContas) || 1,
      valorTotal: dadosTitulo.valorTotal.toString(),
      saldoPagar: dadosTitulo.saldoPagar.toString(),
      emissao: new Date(dadosTitulo.emissao),
      vencimento: new Date(dadosTitulo.vencimento),
    };
    
    console.log('Dados formatados para envio:', tituloData);
    onSave(tituloData);
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setDadosTitulo(prev => ({ ...prev, [field]: value }));
  };

  const handleBaixaChange = (field: string, value: string) => {
    setDadosBaixa(prev => ({ ...prev, [field]: value }));
  };

  const lancarBaixa = () => {
    console.log("Lançando baixa:", dadosBaixa);
    // Aqui seria a lógica para lançar a baixa
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Gerenciar Título {titulo ? `- ${titulo.numeroTitulo || 'ssss'}` : '- Novo'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados">Dados do Título</TabsTrigger>
            <TabsTrigger value="baixas">Baixas</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Empresa *</Label>
                <Select value={dadosTitulo.idEmpresa} onValueChange={(value) => handleInputChange('idEmpresa', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">BPrint</SelectItem>
                    <SelectItem value="2">CL2G</SelectItem>
                    <SelectItem value="3">Wingraph</SelectItem>
                    <SelectItem value="4">Bremen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Fornecedor *</Label>
                <Select value={dadosTitulo.idFornecedor} onValueChange={(value) => handleInputChange('idFornecedor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Energia SP</SelectItem>
                    <SelectItem value="2">Águas SA</SelectItem>
                    <SelectItem value="3">Tech Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Número do Título *</Label>
              <Input
                value={dadosTitulo.numeroTitulo}
                onChange={(e) => handleInputChange('numeroTitulo', e.target.value)}
                placeholder="Número do título"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data de Emissão *</Label>
                <Input
                  type="date"
                  value={dadosTitulo.emissao}
                  onChange={(e) => handleInputChange('emissao', e.target.value)}
                />
              </div>

              <div>
                <Label>Data de Vencimento *</Label>
                <Input
                  type="date"
                  value={dadosTitulo.vencimento}
                  onChange={(e) => handleInputChange('vencimento', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Saldo a Pagar</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    className="pl-8"
                    value={dadosTitulo.saldoPagar}
                    onChange={(e) => handleInputChange('saldoPagar', e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <Label>Valor Total</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    className="pl-8"
                    value={dadosTitulo.valorTotal}
                    onChange={(e) => handleInputChange('valorTotal', e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Plano de Contas</Label>
              <Select value={dadosTitulo.idPlanoContas} onValueChange={(value) => handleInputChange('idPlanoContas', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Principal</SelectItem>
                  <SelectItem value="2">1.1 - Ativo</SelectItem>
                  <SelectItem value="3">2 - Resultado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Descrição</Label>
              <Input
                value={dadosTitulo.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descrição do título"
              />
            </div>

            <div>
              <Label>Observações</Label>
              <Textarea
                value={dadosTitulo.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Observações adicionais (opcional)"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="baixas" className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Saldo Atual</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {dadosTitulo.saldoPagar || '34.444,00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor Original</p>
                  <p className="text-2xl font-bold text-gray-700">R$ {dadosTitulo.valorTotal || '34.444,00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pago</p>
                  <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Lançar Nova Baixa</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Data da Baixa</Label>
                      <Input
                        type="date"
                        value={dadosBaixa.dataBaixa}
                        onChange={(e) => handleBaixaChange('dataBaixa', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Valor Baixa</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <Input
                          className="pl-8"
                          value={dadosBaixa.valorBaixa}
                          onChange={(e) => handleBaixaChange('valorBaixa', e.target.value)}
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Juros</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                          <Input
                            className="pl-8"
                            value={dadosBaixa.juros}
                            onChange={(e) => handleBaixaChange('juros', e.target.value)}
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Desconto</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                          <Input
                            className="pl-8"
                            value={dadosBaixa.desconto}
                            onChange={(e) => handleBaixaChange('desconto', e.target.value)}
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Valor Pago</Label>
                      <Input
                        value={dadosBaixa.valorPago}
                        onChange={(e) => handleBaixaChange('valorPago', e.target.value)}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label>Observação</Label>
                      <Input
                        value={dadosBaixa.observacao}
                        onChange={(e) => handleBaixaChange('observacao', e.target.value)}
                        placeholder="Opcional"
                      />
                    </div>

                    <Button onClick={lancarBaixa} className="w-full bg-blue-600 hover:bg-blue-700">
                      Lançar Baixa
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Histórico de Baixas</h3>
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma baixa registrada.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}