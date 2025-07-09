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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

import PlanoContasSearchModal from "@/components/plano-contas-search-modal";
import FornecedorSearchModal from "@/components/fornecedor-search-modal";

interface TituloModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo?: any;
  onSave: (titulo: any) => void;
  showBaixaTab?: boolean;
}

export default function TituloModal({ open, onOpenChange, titulo, onSave, showBaixaTab = false }: TituloModalProps) {
  const { data: empresas = [] } = useQuery({ queryKey: ["/api/empresas"] });
  const { data: fornecedores = [] } = useQuery({ queryKey: ["/api/fornecedores"] });
  const { data: planoContas = [] } = useQuery({ queryKey: ["/api/plano-contas"] });
  const { data: titulosBaixa = [] } = useQuery({ 
    queryKey: ["/api/titulos-baixa"],
    enabled: !!titulo?.id
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      
      // Initialize baixa data with current saldo and current datetime
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setDadosBaixa({
        dataBaixa: localDateTime,
        valorBaixa: titulo.saldoPagar || "",
        juros: "0,00",
        desconto: "0,00",
        valorPago: titulo.saldoPagar || "",
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
      
      // Reset baixa data with current datetime
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setDadosBaixa({
        dataBaixa: localDateTime,
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



  const lancarBaixaMutation = useMutation({
    mutationFn: async (baixaData: any) => {
      const response = await apiRequest("/api/titulos-baixa", "POST", baixaData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Baixa lançada com sucesso",
        description: "O pagamento foi registrado corretamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/titulos-baixa"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao lançar baixa",
        description: "Ocorreu um erro ao registrar o pagamento.",
        variant: "destructive",
      });
    }
  });

  const cancelarBaixaMutation = useMutation({
    mutationFn: async (baixaId: number) => {
      const response = await apiRequest(`/api/titulos-baixa/${baixaId}`, "PUT", { cancelado: true });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Baixa cancelada com sucesso",
        description: "O valor foi devolvido ao saldo do título.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/titulos-baixa"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cancelar baixa",
        description: "Ocorreu um erro ao cancelar o pagamento.",
        variant: "destructive",
      });
    }
  });

  const lancarBaixa = async () => {
    if (!titulo?.id) {
      toast({
        title: "Erro",
        description: "É necessário selecionar um título válido.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!dadosBaixa.valorBaixa || parseFloat(dadosBaixa.valorBaixa.replace(',', '.')) <= 0) {
      toast({
        title: "Erro",
        description: "Valor da baixa deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    const parseValor = (valor: string) => {
      return parseFloat(valor.replace(',', '.')) || 0;
    };

    const baixaData = {
      idTitulo: Number(titulo.id),
      dataBaixa: new Date(dadosBaixa.dataBaixa).toISOString(),
      valorBaixa: parseValor(dadosBaixa.valorBaixa).toFixed(2),
      valorPago: parseValor(dadosBaixa.valorPago).toFixed(2),
      juros: parseValor(dadosBaixa.juros).toFixed(2),
      desconto: parseValor(dadosBaixa.desconto).toFixed(2),
      observacao: dadosBaixa.observacao || null,
      cancelado: false
    };

    console.log("Lançando baixa:", baixaData);
    lancarBaixaMutation.mutate(baixaData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Gerenciar Título {titulo ? `- ${titulo.numeroTitulo || 'ssss'}` : '- Novo'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={showBaixaTab ? "baixas" : "dados"} className="w-full">
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
                  <p className="text-2xl font-bold text-blue-600">
                    {titulo ? formatCurrency(parseFloat(titulo.saldoPagar || '0')) : 'R$ 0,00'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor Original</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {titulo ? formatCurrency(parseFloat(titulo.valorTotal || '0')) : 'R$ 0,00'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pago</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(() => {
                      const baixasDoTitulo = titulosBaixa.filter((baixa: any) => baixa.idTitulo === titulo?.id && !baixa.cancelado);
                      const totalPago = baixasDoTitulo.reduce((sum: number, baixa: any) => {
                        return sum + parseFloat(baixa.valorPago || '0');
                      }, 0);
                      return formatCurrency(totalPago);
                    })()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Lançar Nova Baixa</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Data e Hora da Baixa</Label>
                      <Input
                        type="datetime-local"
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

                    <Button 
                      onClick={lancarBaixa} 
                      disabled={lancarBaixaMutation.isPending || parseFloat(titulo?.saldoPagar?.replace(',', '.') || '0') === 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {lancarBaixaMutation.isPending ? "Lançando..." : 
                       parseFloat(titulo?.saldoPagar?.replace(',', '.') || '0') === 0 ? "Título Liquidado" : "Lançar Baixa"}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Histórico de Baixas</h3>
                  {titulosBaixa.filter((baixa: any) => baixa.idTitulo === titulo?.id).length > 0 ? (
                    <div className="space-y-2">
                      {titulosBaixa
                        .filter((baixa: any) => baixa.idTitulo === titulo?.id)
                        .map((baixa: any) => (
                          <div key={baixa.id} className={`p-3 rounded-lg ${baixa.cancelado ? 'bg-red-50' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium">
                                    {formatDate(new Date(baixa.dataBaixa))} às {new Date(baixa.dataBaixa).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  {baixa.cancelado && (
                                    <Badge variant="destructive" className="text-xs">
                                      CANCELADA
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  Baixa: {formatCurrency(parseFloat(baixa.valorBaixa || '0'))}
                                </p>
                                {baixa.observacao && (
                                  <p className="text-sm text-gray-500">{baixa.observacao}</p>
                                )}
                              </div>
                              <div className="text-right flex items-center space-x-2">
                                <div>
                                  <p className={`font-semibold ${baixa.cancelado ? 'text-red-600 line-through' : 'text-green-600'}`}>
                                    {formatCurrency(parseFloat(baixa.valorPago || '0'))}
                                  </p>
                                  {(parseFloat(baixa.juros || '0') > 0 || parseFloat(baixa.desconto || '0') > 0) && (
                                    <p className="text-xs text-gray-500">
                                      {parseFloat(baixa.juros || '0') > 0 && `+${formatCurrency(parseFloat(baixa.juros))}`}
                                      {parseFloat(baixa.desconto || '0') > 0 && ` -${formatCurrency(parseFloat(baixa.desconto))}`}
                                    </p>
                                  )}
                                </div>
                                {!baixa.cancelado && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => cancelarBaixaMutation.mutate(baixa.id)}
                                    disabled={cancelarBaixaMutation.isPending}
                                    className="h-8 w-8 p-0 hover:bg-red-100"
                                    title="Cancelar baixa"
                                  >
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhuma baixa registrada.</p>
                    </div>
                  )}
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