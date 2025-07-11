import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import PlanoContasSearchModal from "@/components/plano-contas-search-modal";
import FornecedorSearchModal from "@/components/fornecedor-search-modal";
import TituloModal from "@/components/titulo-modal";
import ConfirmDialog from "@/components/confirm-dialog";

interface ContratoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato?: any;
  onSave: (contrato: any) => void;
  showTitulosTab?: boolean;
}

export default function ContratoModal({ open, onOpenChange, contrato, onSave, showTitulosTab = false }: ContratoModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dadosContrato, setDadosContrato] = useState({
    idEmpresa: '',
    idFornecedor: '',
    idPlanoContas: '',
    descricao: '',
    valorContrato: '',
    valorParcela: '',
    numParcela: '',
    dataInicio: '',
    diaVencimento: '',
    parcelaInicial: '',
    numeroTitulo: '',
    mascara: '',
    status: true,
    observacoes: ''
  });

  const [planoContasModalOpen, setPlanoContasModalOpen] = useState(false);
  const [fornecedorModalOpen, setFornecedorModalOpen] = useState(false);
  const [tituloModalOpen, setTituloModalOpen] = useState(false);
  const [tituloSelecionado, setTituloSelecionado] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tituloParaCancelar, setTituloParaCancelar] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(showTitulosTab ? "titulos" : "dados");

  const { data: empresas = [] } = useQuery({ queryKey: ['/api/empresas'] });
  const { data: fornecedores = [] } = useQuery({ queryKey: ['/api/fornecedores'] });
  const { data: planoContas = [] } = useQuery({ queryKey: ['/api/plano-contas'] });
  const { data: titulos = [] } = useQuery({ queryKey: ['/api/titulos'] });

  // Update active tab when modal opens or showTitulosTab changes
  useEffect(() => {
    if (open) {
      setActiveTab(showTitulosTab ? "titulos" : "dados");
    }
  }, [open, showTitulosTab]);

  useEffect(() => {
    if (contrato) {
      setDadosContrato({
        idEmpresa: contrato.idEmpresa?.toString() || '',
        idFornecedor: contrato.idFornecedor?.toString() || '',
        idPlanoContas: contrato.idPlanoContas?.toString() || '',
        descricao: contrato.descricao || '',
        valorContrato: contrato.valorContrato?.toString() || '',
        valorParcela: contrato.valorParcela?.toString() || '',
        numParcela: contrato.numParcela?.toString() || '',
        dataInicio: contrato.dataInicio ? contrato.dataInicio.split('T')[0] : '',
        diaVencimento: contrato.diaVencimento?.toString() || '',
        parcelaInicial: contrato.parcelaInicial?.toString() || '',
        numeroTitulo: contrato.numeroTitulo || '',
        mascara: contrato.mascara?.toString() || '',
        status: contrato.status !== undefined ? contrato.status : true,
        observacoes: contrato.observacoes || ''
      });
    } else {
      setDadosContrato({
        idEmpresa: '',
        idFornecedor: '',
        idPlanoContas: '',
        descricao: '',
        valorContrato: '',
        valorParcela: '',
        numParcela: '',
        dataInicio: '',
        diaVencimento: '',
        parcelaInicial: '',
        numeroTitulo: '',
        mascara: '',
        status: true,
        observacoes: ''
      });
    }
  }, [contrato, open]);

  const handleInputChange = (field: string, value: any) => {
    setDadosContrato(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const dataFormatada = {
      ...dadosContrato,
      idEmpresa: parseInt(dadosContrato.idEmpresa),
      idFornecedor: parseInt(dadosContrato.idFornecedor),
      idPlanoContas: parseInt(dadosContrato.idPlanoContas),
      valorContrato: dadosContrato.valorContrato,
      valorParcela: dadosContrato.valorParcela,
      numParcela: parseInt(dadosContrato.numParcela),
      diaVencimento: parseInt(dadosContrato.diaVencimento),
      parcelaInicial: parseInt(dadosContrato.parcelaInicial),
      mascara: parseInt(dadosContrato.mascara),
      dataInicio: dadosContrato.dataInicio,
    };

    // Se é edição com títulos gerados, enviar flag para atualizar títulos relacionados
    if (isEdicao && temTitulosGerados) {
      dataFormatada.atualizarTitulos = true;
    }

    onSave(dataFormatada);
    onOpenChange(false);
  };

  const titulosDoContrato = titulos
    .filter((titulo: any) => titulo.idContrato === contrato?.id)
    .sort((a: any, b: any) => {
      // Ordenar por vencimento (mais antigo primeiro)
      const dataA = new Date(a.vencimento);
      const dataB = new Date(b.vencimento);
      return dataA.getTime() - dataB.getTime();
    });
  
  // Detectar se contrato tem títulos gerados (bloqueio condicional)
  const temTitulosGerados = titulosDoContrato.length > 0;
  const isEdicao = !!contrato;
  
  // Campos que devem ser bloqueados quando há títulos gerados
  const camposBloqueados = isEdicao && temTitulosGerados;

  // Mutation para gerar títulos
  const gerarTitulosMutation = useMutation({
    mutationFn: async (contratoId: number) => {
      const response = await apiRequest(`/api/contratos/${contratoId}/gerar-titulos`, "POST");
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Títulos gerados com sucesso",
        description: "Os títulos foram criados conforme os parâmetros do contrato.",
      });
      // Invalida as queries para atualizar a listagem de títulos
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      // Força refetch imediato dos títulos
      queryClient.refetchQueries({ queryKey: ["/api/titulos"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao gerar títulos",
        description: "Ocorreu um erro ao criar os títulos do contrato.",
        variant: "destructive",
      });
    }
  });

  const handleGerarTitulos = () => {
    if (contrato?.id) {
      gerarTitulosMutation.mutate(contrato.id);
    }
  };

  const handleOpenTituloModal = (titulo: any) => {
    setTituloSelecionado(titulo);
    setTituloModalOpen(true);
  };

  const handleSaveTitulo = async (dadosTitulo: any) => {
    try {
      if (tituloSelecionado) {
        await apiRequest(`/api/titulos/${tituloSelecionado.id}`, "PUT", dadosTitulo);
        toast({
          title: "Título atualizado com sucesso",
          description: "As alterações foram salvas.",
        });
      }
      // Invalida as queries para atualizar as listagens
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      setTituloModalOpen(false);
      setTituloSelecionado(null);
    } catch (error) {
      toast({
        title: "Erro ao salvar título",
        description: "Ocorreu um erro ao atualizar o título.",
        variant: "destructive",
      });
    }
  };

  const handleAbrirConfirmacaoCancelamento = (titulo: any) => {
    setTituloParaCancelar(titulo);
    setConfirmDialogOpen(true);
  };

  const handleCancelarTitulo = async () => {
    try {
      if (tituloParaCancelar) {
        await apiRequest(`/api/titulos/${tituloParaCancelar.id}`, "PUT", { status: 4 });
        toast({
          title: "Título cancelado com sucesso",
          description: "O título foi cancelado.",
        });
        // Invalida as queries para atualizar as listagens
        queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
        queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      }
      setConfirmDialogOpen(false);
      setTituloParaCancelar(null);
    } catch (error) {
      toast({
        title: "Erro ao cancelar título",
        description: "Ocorreu um erro ao cancelar o título.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contrato ? 'Editar Contrato' : 'Novo Contrato'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
            <TabsTrigger value="titulos">Títulos</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            {/* Linha 1: Empresa, Fornecedor, Descrição (2 colunas) */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Empresa *</Label>
                <Select value={dadosContrato.idEmpresa} onValueChange={(value) => handleInputChange('idEmpresa', value)} disabled={camposBloqueados}>
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
                  disabled={camposBloqueados}
                >
                  {dadosContrato.idFornecedor ? (
                    (() => {
                      const fornecedor = fornecedores.find(f => f.id === parseInt(dadosContrato.idFornecedor));
                      return fornecedor ? fornecedor.nome : "Selecionar fornecedor";
                    })()
                  ) : (
                    "Selecionar fornecedor"
                  )}
                </Button>
              </div>

              <div className="col-span-2">
                <Label>Descrição *</Label>
                <Input
                  value={dadosContrato.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descrição do contrato"
                />
              </div>
            </div>

            {/* Linha 2: Valor do Contrato, Número de Parcelas, Valor da Parcela, Número do Título */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Valor do Contrato *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    className="pl-8"
                    value={dadosContrato.valorContrato}
                    onChange={(e) => handleInputChange('valorContrato', e.target.value)}
                    placeholder="0,00"
                    disabled={camposBloqueados}
                  />
                </div>
              </div>

              <div>
                <Label>Nº de Parcelas *</Label>
                <Input
                  value={dadosContrato.numParcela}
                  onChange={(e) => handleInputChange('numParcela', e.target.value)}
                  placeholder="12"
                  disabled={camposBloqueados}
                />
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
                <Label>Número do Título *</Label>
                <Input
                  value={dadosContrato.numeroTitulo}
                  onChange={(e) => handleInputChange('numeroTitulo', e.target.value)}
                  placeholder="Número do título"
                />
              </div>
            </div>

            {/* Linha 3: Data de Início, Dia do Vencimento, Iniciar na Parcela, Máscara */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Data de Início *</Label>
                <Input
                  type="date"
                  value={dadosContrato.dataInicio}
                  onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                  disabled={camposBloqueados}
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
                  disabled={camposBloqueados}
                />
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Máscara *</Label>
                    <Select value={dadosContrato.mascara} onValueChange={(value) => handleInputChange('mascara', value)} disabled={camposBloqueados}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar máscara" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - "Número - Parcela/Total"</SelectItem>
                        <SelectItem value="2">2 - "Número - Parcela"</SelectItem>
                        <SelectItem value="3">3 - "Somente Número"</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    {dadosContrato.mascara && (
                      <div className="bg-blue-50 p-3 rounded-md mt-6">
                        <p className="text-sm text-blue-700">
                          <strong>Exemplo:</strong> {(() => {
                            const numeroTitulo = dadosContrato.numeroTitulo || 'T001';
                            const totalParcelas = parseInt(dadosContrato.numParcela || "10");
                            const parcelaDigits = totalParcelas.toString().length;
                            const parcela = "1".padStart(parcelaDigits, '0');
                            const totalFormatted = totalParcelas.toString().padStart(parcelaDigits, '0');
                            
                            switch(dadosContrato.mascara) {
                              case "1":
                                return `${numeroTitulo} - ${parcela}/${totalFormatted}`;
                              case "2":
                                return `${numeroTitulo} - ${parcela}`;
                              case "3":
                                return numeroTitulo;
                              default:
                                return `${numeroTitulo} - ${parcela}/${totalFormatted}`;
                            }
                          })()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={dadosContrato.status.toString()} onValueChange={(value) => handleInputChange('status', value === 'true')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 4: Plano de Contas, Observações */}
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
                      const conta = planoContas.find(c => c.id === parseInt(dadosContrato.idPlanoContas));
                      return conta ? `${conta.codigo} - ${conta.nome}` : "Selecionar plano de contas";
                    })()
                  ) : (
                    "Selecionar plano de contas"
                  )}
                </Button>
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea
                  value={dadosContrato.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Observações sobre o contrato"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="titulos" className="space-y-4">
            {titulosDoContrato.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número Título</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Valor Título</TableHead>
                      <TableHead className="text-right">Valor Pago</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {titulosDoContrato.map((titulo: any) => {
                      const valorTitulo = titulo.valorTotal || titulo.valorPagar || 0;
                      const saldo = titulo.saldoPagar || 0;
                      const valorPago = valorTitulo - saldo;
                      
                      return (
                        <TableRow 
                          key={titulo.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleOpenTituloModal(titulo)}
                        >
                          <TableCell>{titulo.numeroTitulo}</TableCell>
                          <TableCell>{formatDate(titulo.vencimento)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(valorTitulo)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(valorPago)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(saldo)}</TableCell>
                          <TableCell>
                            <Badge variant={titulo.status === 1 ? "default" : "secondary"}>
                              {titulo.status === 1 ? "Em Aberto" : 
                               titulo.status === 2 ? "Parcial" : 
                               titulo.status === 3 ? "Pago" : "Cancelado"}
                            </Badge>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenTituloModal(titulo)}
                                className="h-8 w-8 p-0"
                                title="Editar título"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Button>
                              {titulo.status !== 4 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAbrirConfirmacaoCancelamento(titulo)}
                                  className="h-8 w-8 p-0 text-slate-600 hover:text-slate-800"
                                  title="Cancelar título"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum título encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Clique em "Gerar Títulos" para criar os títulos automaticamente.
                </p>
              </div>
            )}
            
            {/* Botões de ação para a aba de títulos */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-2">
                {/* Botão "Gerar Títulos" - só aparece se não há títulos gerados */}
                {!temTitulosGerados && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleGerarTitulos}
                    disabled={gerarTitulosMutation.isPending}
                  >
                    {gerarTitulosMutation.isPending ? "Gerando..." : "Gerar Títulos"}
                  </Button>
                )}
                
                {/* Botões "Liquidar" e "Cancelar" - só aparecem se há títulos gerados */}
                {temTitulosGerados && (
                  <>
                    <Button 
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        // Implementar lógica para liquidar contrato
                        console.log("Liquidar Contrato clicado para contrato:", contrato?.id);
                      }}
                    >
                      Liquidar Contrato
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        // Implementar lógica para cancelar contrato
                        console.log("Cancelar Contrato clicado para contrato:", contrato?.id);
                      }}
                    >
                      Cancelar Contrato
                    </Button>
                  </>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Botões apenas na aba de dados */}
        {activeTab === 'dados' && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button onClick={handleSave}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {contrato ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        )}
      </DialogContent>
      
      <PlanoContasSearchModal
        open={planoContasModalOpen}
        onOpenChange={setPlanoContasModalOpen}
        planoContas={planoContas}
        onSelect={(conta) => {
          handleInputChange('idPlanoContas', conta.id.toString());
          setPlanoContasModalOpen(false);
        }}
        selectedId={dadosContrato.idPlanoContas}
      />
      
      <FornecedorSearchModal
        open={fornecedorModalOpen}
        onOpenChange={setFornecedorModalOpen}
        fornecedores={fornecedores}
        onSelect={(fornecedor) => {
          handleInputChange('idFornecedor', fornecedor.id.toString());
          setFornecedorModalOpen(false);
        }}
        selectedId={dadosContrato.idFornecedor}
      />
      
      <TituloModal
        open={tituloModalOpen}
        onOpenChange={setTituloModalOpen}
        titulo={tituloSelecionado}
        onSave={handleSaveTitulo}
      />
      
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Cancelar Título"
        description={`Tem certeza que deseja cancelar o título ${tituloParaCancelar?.numeroTitulo}? Esta ação não pode ser desfeita.`}
        onConfirm={handleCancelarTitulo}
      />
    </Dialog>
  );
}