import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { fetchEmpresas, fetchFornecedores, fetchPlanoContas } from "@/lib/api";
import FornecedorSelect from "@/components/fornecedor-select";
import PlanoContasSearchModal from "@/components/plano-contas-search-modal";
import FornecedorSearchModal from "@/components/fornecedor-search-modal";

interface ContratoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato?: any;
  onSave: (contrato: any) => void;
}

export default function ContratoModal({ open, onOpenChange, contrato, onSave }: ContratoModalProps) {
  const { data: empresas = [] } = useQuery({
    queryKey: ["/api/empresas"],
    queryFn: fetchEmpresas,
  });

  const { data: fornecedores = [] } = useQuery({
    queryKey: ["/api/fornecedores"],
    queryFn: fetchFornecedores,
  });

  const { data: planoContas = [] } = useQuery({
    queryKey: ["/api/plano-contas"],
    queryFn: fetchPlanoContas,
  });

  const [dadosContrato, setDadosContrato] = useState({
    idEmpresa: contrato?.idEmpresa || null,
    idFornecedor: contrato?.idFornecedor || null,
    descricao: contrato?.descricao || "",
    valorContrato: contrato?.valorContrato || "",
    valorParcela: contrato?.valorParcela || "",
    numParcela: contrato?.numParcela || "",
    dataInicio: contrato?.dataInicio || "",
    diaVencimento: contrato?.diaVencimento || "",
    parcelaInicial: contrato?.parcelaInicial || "",
    numeroTitulo: contrato?.numeroTitulo || "",
    mascara: contrato?.mascara || "",
    idPlanoContas: contrato?.idPlanoContas || null,
    status: contrato?.status !== undefined ? contrato.status : true,
    observacoes: contrato?.observacoes || ""
  });

  const [planoContasModalOpen, setPlanoContasModalOpen] = useState(false);
  const [fornecedorModalOpen, setFornecedorModalOpen] = useState(false);

  // Update form data when contrato prop changes
  useEffect(() => {
    if (contrato) {
      setDadosContrato({
        idEmpresa: contrato.idEmpresa || null,
        idFornecedor: contrato.idFornecedor || null,
        descricao: contrato.descricao || "",
        valorContrato: contrato.valorContrato || "",
        valorParcela: contrato.valorParcela || "",
        numParcela: contrato.numParcela || "",
        dataInicio: contrato.dataInicio ? contrato.dataInicio.split('T')[0] : "",
        diaVencimento: contrato.diaVencimento || "",
        parcelaInicial: contrato.parcelaInicial || "",
        numeroTitulo: contrato.numeroTitulo || "",
        tipoMascara: contrato.tipoMascara || "",
        idPlanoContas: contrato.idPlanoContas || null,
        status: true, // Status sempre inicia como ativo
        observacoes: contrato.observacoes || ""
      });
    } else {
      // Reset form for new contrato
      setDadosContrato({
        idEmpresa: null,
        idFornecedor: null,
        descricao: "",
        valorContrato: "",
        valorParcela: "",
        numParcela: "",
        dataInicio: "",
        diaVencimento: "",
        parcelaInicial: "",
        numeroTitulo: "",
        tipoMascara: "",
        idPlanoContas: null,
        status: true,
        observacoes: ""
      });
    }
  }, [contrato]);

  const handleSave = () => {
    // Converter tipos apropriadamente antes de salvar
    const contratoFormatado = {
      idEmpresa: parseInt(dadosContrato.idEmpresa) || null,
      idFornecedor: parseInt(dadosContrato.idFornecedor) || null,
      idPlanoContas: parseInt(dadosContrato.idPlanoContas) || null,
      descricao: dadosContrato.descricao || '',
      valorContrato: dadosContrato.valorContrato?.toString() || '0',
      valorParcela: dadosContrato.valorParcela?.toString() || '0',
      numParcela: parseInt(dadosContrato.numParcela) || 0,
      diaVencimento: parseInt(dadosContrato.diaVencimento) || 0,
      parcelaInicial: parseInt(dadosContrato.parcelaInicial) || 1,
      dataInicio: dadosContrato.dataInicio || new Date().toISOString().split('T')[0],
      numeroTitulo: dadosContrato.numeroTitulo || '',
      tipoMascara: dadosContrato.tipoMascara === 'sequencial' ? 1 : 2,
      status: dadosContrato.status === 'Ativo',
      observacoes: dadosContrato.observacoes || ''
    };
    
    console.log('Salvando contrato:', contratoFormatado);
    onSave(contratoFormatado);
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
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
                <Select value={dadosContrato.idEmpresa?.toString()} onValueChange={(value) => handleInputChange('idEmpresa', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa: any) => (
                      <SelectItem key={empresa.id} value={empresa.id.toString()}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Fornecedor *</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setFornecedorModalOpen(true)}
                >
                  {dadosContrato.idFornecedor ? (
                    (() => {
                      const fornecedor = fornecedores.find(f => f.id === dadosContrato.idFornecedor);
                      return fornecedor ? fornecedor.nome : "Selecionar fornecedor";
                    })()
                  ) : (
                    "Selecionar fornecedor"
                  )}
                </Button>
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
                  value={dadosContrato.numParcela}
                  onChange={(e) => handleInputChange('numParcela', e.target.value)}
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
                  value={dadosContrato.parcelaInicial}
                  onChange={(e) => handleInputChange('parcelaInicial', e.target.value)}
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
                <Label>Máscara *</Label>
                <Select value={dadosContrato.mascara} onValueChange={(value) => handleInputChange('mascara', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar máscara" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="titulo-parcela">Título - 99/99 - Título + parcela/total</SelectItem>
                    <SelectItem value="sequencial">Sequencial - 001, 002, 003...</SelectItem>
                    <SelectItem value="alfanumerico">Alfanumérico - ABC001, ABC002...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {dadosContrato.mascara && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Exemplo:</strong> {dadosContrato.numeroTitulo || 'xxxxx'} - 1/3
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plano de Contas</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setPlanoContasModalOpen(true)}
                >
                  {dadosContrato.idPlanoContas ? (
                    (() => {
                      const conta = planoContas.find(c => c.id === dadosContrato.idPlanoContas);
                      return conta ? `${conta.codigo} - ${conta.nome}` : "Selecionar conta";
                    })()
                  ) : (
                    "Selecionar conta"
                  )}
                </Button>
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
      
      <PlanoContasSearchModal
        open={planoContasModalOpen}
        onOpenChange={setPlanoContasModalOpen}
        planoContas={planoContas}
        onSelect={(conta) => handleInputChange('idPlanoContas', conta.id)}
        selectedId={dadosContrato.idPlanoContas?.toString()}
      />
      
      <FornecedorSearchModal
        open={fornecedorModalOpen}
        onOpenChange={setFornecedorModalOpen}
        fornecedores={fornecedores}
        onSelect={(fornecedor) => handleInputChange('idFornecedor', fornecedor.id)}
        selectedId={dadosContrato.idFornecedor?.toString()}
      />
    </Dialog>
  );
}