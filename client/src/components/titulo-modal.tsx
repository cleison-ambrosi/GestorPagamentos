import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";

import PlanoContasSearchModal from "@/components/plano-contas-search-modal";
import FornecedorSearchModal from "@/components/fornecedor-search-modal";

interface TituloModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo?: any;
  onSave: (titulo: any) => void;
}

export default function TituloModal({ open, onOpenChange, titulo, onSave }: TituloModalProps) {
  const { data: empresas = [] } = useQuery({ queryKey: ["/api/empresas"] });
  const { data: fornecedores = [] } = useQuery({ queryKey: ["/api/fornecedores"] });
  const { data: planoContas = [] } = useQuery({ queryKey: ["/api/plano-contas"] });

  // Função para converter status numérico para texto
  const getStatusLabel = (status: string | number) => {
    const numStatus = typeof status === 'string' ? parseInt(status) : status;
    switch (numStatus) {
      case 1: return 'Em Aberto';
      case 2: return 'Parcial';
      case 3: return 'Pago';
      case 4: return 'Cancelado';
      default: return 'Em Aberto';
    }
  };
  const [dadosTitulo, setDadosTitulo] = useState({
    idEmpresa: titulo?.idEmpresa?.toString() || "",
    idFornecedor: titulo?.idFornecedor?.toString() || "",
    numeroTitulo: titulo?.numeroTitulo || "",
    emissao: titulo?.emissao ? titulo.emissao.split('T')[0] : new Date().toISOString().split('T')[0],
    vencimento: titulo?.vencimento || "",
    valorTotal: titulo?.valorTotal?.toString() || "",
    saldoPagar: titulo?.saldoPagar?.toString() || titulo?.valorTotal?.toString() || "",
    idPlanoContas: titulo?.idPlanoContas?.toString() || "",
    descricao: titulo?.descricao || "",
    observacoes: titulo?.observacoes || "",
    status: titulo?.status || "1"
  });

  const [dadosBaixa, setDadosBaixa] = useState({
    dataBaixa: new Date().toISOString().split('T')[0],
    valorBaixa: dadosTitulo.saldoPagar || "",
    juros: "0,00",
    desconto: "0,00",
    valorPago: dadosTitulo.saldoPagar || "",
    observacao: ""
  });

  const [planoContasModalOpen, setPlanoContasModalOpen] = useState(false);
  const [fornecedorModalOpen, setFornecedorModalOpen] = useState(false);

  // Função para calcular valor pago automaticamente
  const calcularValorPago = (valorBaixa: string, juros: string, desconto: string) => {
    const parseValor = (valor: string) => {
      return parseFloat(valor.replace(',', '.')) || 0;
    };
    
    const valorBaixaNum = parseValor(valorBaixa);
    const jurosNum = parseValor(juros);
    const descontoNum = parseValor(desconto);
    
    const valorPago = valorBaixaNum + jurosNum - descontoNum;
    return valorPago.toFixed(2).replace('.', ',');
  };

  // Handler para atualizar dados da baixa com cálculo automático
  const handleBaixaChange = (field: string, value: string) => {
    const newDadosBaixa = { ...dadosBaixa, [field]: value };
    
    // Se alterou valor baixa, juros ou desconto, recalcular valor pago
    if (field === 'valorBaixa' || field === 'juros' || field === 'desconto') {
      newDadosBaixa.valorPago = calcularValorPago(
        field === 'valorBaixa' ? value : dadosBaixa.valorBaixa,
        field === 'juros' ? value : dadosBaixa.juros,
        field === 'desconto' ? value : dadosBaixa.desconto
      );
    }
    
    setDadosBaixa(newDadosBaixa);
  };

  // Update form data when titulo prop changes
  useEffect(() => {
    if (titulo) {
      const saldoAtual = titulo.saldoPagar?.toString() || "";
      setDadosTitulo({
        idEmpresa: titulo.idEmpresa?.toString() || "",
        idFornecedor: titulo.idFornecedor?.toString() || "",
        numeroTitulo: titulo.numeroTitulo || "",
        emissao: titulo.emissao ? titulo.emissao.split('T')[0] : new Date().toISOString().split('T')[0],
        vencimento: titulo.vencimento ? titulo.vencimento.split('T')[0] : "",
        valorTotal: titulo.valorTotal?.toString() || "",
        saldoPagar: saldoAtual,
        idPlanoContas: titulo.idPlanoContas?.toString() || "",
        descricao: titulo.descricao || "",
        observacoes: titulo.observacoes || "",
        status: titulo.status || "1"
      });
      
      // Initialize baixa data with current saldo
      setDadosBaixa({
        dataBaixa: new Date().toISOString().split('T')[0],
        valorBaixa: saldoAtual,
        juros: "0,00",
        desconto: "0,00",
        valorPago: saldoAtual,
        observacao: ""
      });
    } else {
      // Reset form for new titulo
      setDadosTitulo({
        idEmpresa: titulo?.idEmpresa?.toString() || "",
        idFornecedor: "",
        numeroTitulo: "",
        emissao: new Date().toISOString().split('T')[0],
        vencimento: "",
        valorTotal: "",
        saldoPagar: "",
        idPlanoContas: "",
        descricao: "",
        observacoes: "",
        status: "1"
      });
      
      // Reset baixa data
      setDadosBaixa({
        dataBaixa: new Date().toISOString().split('T')[0],
        valorBaixa: "",
        juros: "0,00",
        desconto: "0,00",
        valorPago: "",
        observacao: ""
      });
    }
  }, [titulo]);

  const handleSave = () => {
    // Validação dos campos obrigatórios
    if (!dadosTitulo.descricao.trim()) {
      alert('Descrição é obrigatória');
      return;
    }
    if (!dadosTitulo.idEmpresa) {
      alert('Empresa é obrigatória');
      return;
    }
    if (!dadosTitulo.idFornecedor) {
      alert('Fornecedor é obrigatório');
      return;
    }
    if (!dadosTitulo.valorTotal) {
      alert('Valor Total é obrigatório');
      return;
    }
    if (!dadosTitulo.vencimento) {
      alert('Data de Vencimento é obrigatória');
      return;
    }

    // Converter string values para o formato correto do backend
    const tituloData = {
      ...dadosTitulo,
      idEmpresa: parseInt(dadosTitulo.idEmpresa),
      idFornecedor: parseInt(dadosTitulo.idFornecedor),
      idPlanoContas: dadosTitulo.idPlanoContas ? parseInt(dadosTitulo.idPlanoContas) : null,
      valorTotal: dadosTitulo.valorTotal.toString(),
      saldoPagar: dadosTitulo.saldoPagar.toString(),
      emissao: dadosTitulo.emissao,
      vencimento: dadosTitulo.vencimento,
      status: parseInt(dadosTitulo.status)
    };
    
    console.log('Dados formatados para envio:', tituloData);
    onSave(tituloData);
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setDadosTitulo(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-fill saldoPagar when valorTotal changes se status = em aberto (1)
      if (field === 'valorTotal' && value && (updated.status === "1" || updated.status === 1)) {
        updated.saldoPagar = value;
      }
      
      return updated;
    });
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Empresa *</Label>
                <Select value={dadosTitulo.idEmpresa} onValueChange={(value) => handleInputChange('idEmpresa', value)}>
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
                  variant="outline"
                  className="w-full justify-start h-10 px-3 text-left font-normal"
                  onClick={() => setFornecedorModalOpen(true)}
                >
                  {dadosTitulo.idFornecedor ? (
                    (() => {
                      const forn = fornecedores.find(f => f.id.toString() === dadosTitulo.idFornecedor);
                      return forn ? forn.nome : "Selecionar fornecedor";
                    })()
                  ) : (
                    "Selecionar fornecedor"
                  )}
                </Button>
              </div>

              <div>
                <Label>Número do Título *</Label>
                <Input
                  value={dadosTitulo.numeroTitulo}
                  onChange={(e) => handleInputChange('numeroTitulo', e.target.value)}
                  placeholder="Número do título"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Data de Emissão *</Label>
                <Input
                  type="date"
                  value={dadosTitulo.emissao}
                  onChange={(e) => handleInputChange('emissao', e.target.value)}
                  readOnly
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

              <div>
                <Label>Plano de Contas</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setPlanoContasModalOpen(true)}
                >
                  {dadosTitulo.idPlanoContas ? (
                    (() => {
                      const conta = planoContas.find(c => c.id.toString() === dadosTitulo.idPlanoContas);
                      return conta ? `${conta.codigo} - ${conta.nome}` : "Selecionar conta";
                    })()
                  ) : (
                    "Selecionar conta"
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Valor Total *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    className="pl-8"
                    value={dadosTitulo.valorTotal}
                    onChange={(e) => handleInputChange('valorTotal', e.target.value)}
                    placeholder="0,00"
                    required
                    readOnly={titulo && dadosTitulo.status !== "1"}
                  />
                </div>
              </div>

              <div>
                <Label>Saldo a Pagar</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    className="pl-8"
                    value={dadosTitulo.saldoPagar}
                    onChange={(e) => handleInputChange('saldoPagar', e.target.value)}
                    placeholder="0,00"
                    readOnly={titulo && dadosTitulo.status !== "1"}
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Input
                  value={getStatusLabel(dadosTitulo.status)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>



            <div>
              <Label>Descrição *</Label>
              <Input
                value={dadosTitulo.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descrição do título"
                required
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
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <Input
                          className="pl-8 bg-gray-50"
                          value={dadosBaixa.valorPago}
                          readOnly
                          placeholder="0,00"
                        />
                      </div>
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
      
      <PlanoContasSearchModal
        open={planoContasModalOpen}
        onOpenChange={setPlanoContasModalOpen}
        planoContas={planoContas}
        onSelect={(conta) => handleInputChange('idPlanoContas', conta.id.toString())}
        selectedId={dadosTitulo.idPlanoContas}
      />
      
      <FornecedorSearchModal
        open={fornecedorModalOpen}
        onOpenChange={setFornecedorModalOpen}
        fornecedores={fornecedores}
        onSelect={(fornecedor) => {
          handleInputChange('idFornecedor', fornecedor.id.toString());
          setFornecedorModalOpen(false);
        }}
        selectedId={dadosTitulo.idFornecedor}
      />
    </Dialog>
  );
}