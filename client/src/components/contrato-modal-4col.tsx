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
import { useQuery } from "@tanstack/react-query";

import PlanoContasSearchModal from "@/components/plano-contas-search-modal";
import FornecedorSearchModal from "@/components/fornecedor-search-modal";

interface ContratoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato?: any;
  onSave: (contrato: any) => void;
}

export default function ContratoModal({ open, onOpenChange, contrato, onSave }: ContratoModalProps) {
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

  const { data: empresas = [] } = useQuery({ queryKey: ['/api/empresas'] });
  const { data: fornecedores = [] } = useQuery({ queryKey: ['/api/fornecedores'] });
  const { data: planoContas = [] } = useQuery({ queryKey: ['/api/plano-contas'] });
  const { data: titulos = [] } = useQuery({ queryKey: ['/api/titulos'] });

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
      valorContrato: parseFloat(dadosContrato.valorContrato),
      valorParcela: parseFloat(dadosContrato.valorParcela),
      numParcela: parseInt(dadosContrato.numParcela),
      diaVencimento: parseInt(dadosContrato.diaVencimento),
      parcelaInicial: parseInt(dadosContrato.parcelaInicial),
      mascara: parseInt(dadosContrato.mascara),
      dataInicio: new Date(dadosContrato.dataInicio).toISOString(),
    };

    onSave(dataFormatada);
    onOpenChange(false);
  };

  const titulosDoContrato = titulos.filter((titulo: any) => titulo.idContrato === contrato?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contrato ? 'Editar Contrato' : 'Novo Contrato'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
            <TabsTrigger value="titulos">Títulos</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            {/* Linha 1: Empresa, Fornecedor, Descrição (2 colunas) */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Empresa *</Label>
                <Select value={dadosContrato.idEmpresa} onValueChange={(value) => handleInputChange('idEmpresa', value)}>
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

              <div className="col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Máscara *</Label>
                    <Select value={dadosContrato.mascara} onValueChange={(value) => handleInputChange('mascara', value)}>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {titulosDoContrato.map((titulo: any) => (
                    <TableRow key={titulo.id}>
                      <TableCell>{titulo.numeroTitulo}</TableCell>
                      <TableCell>{formatDate(titulo.vencimento)}</TableCell>
                      <TableCell>{formatCurrency(titulo.valorTotal)}</TableCell>
                      <TableCell>{formatCurrency(titulo.saldoPagar)}</TableCell>
                      <TableCell>
                        <Badge variant={titulo.status === 1 ? "default" : "secondary"}>
                          {titulo.status === 1 ? "Em Aberto" : 
                           titulo.status === 2 ? "Parcial" : 
                           titulo.status === 3 ? "Pago" : "Cancelado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {contrato ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
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
    </Dialog>
  );
}