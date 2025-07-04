import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Copy, Trash2, Search, Eye, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import ConfirmDialog from "@/components/confirm-dialog";
import ContratoModal from "@/components/contrato-modal";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo dos contratos
const contratosData = [
  {
    id: 1,
    numeroTitulo: "XXXXX",
    fornecedor: "Energia SP",
    numeroParcelas: 3,
    diaVencimento: 16,
    valorParcela: 7407.33,
    status: "ativo"
  }
];

export default function Contratos() {
  const { data: contratos, isLoading } = useQuery({
    queryKey: ["/api/contratos"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContrato, setEditingContrato] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {}
  });

  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/contratos", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({
        title: "Sucesso",
        description: "Contrato criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar contrato. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/contratos/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({
        title: "Sucesso",
        description: "Contrato atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar contrato. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/contratos/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({
        title: "Sucesso",
        description: "Contrato excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir contrato. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleNew = () => {
    setEditingContrato(null);
    setModalOpen(true);
  };

  const handleEdit = (contrato: any) => {
    setEditingContrato(contrato);
    setModalOpen(true);
  };

  const handleDuplicate = (contrato: any) => {
    const duplicatedContrato = {
      ...contrato,
      numeroContrato: `${contrato.numeroContrato}_copy`,
      id: undefined
    };
    setEditingContrato(duplicatedContrato);
    setModalOpen(true);
  };

  const handleSave = (contratoData: any) => {
    if (editingContrato?.id) {
      updateMutation.mutate({ id: editingContrato.id, data: contratoData });
    } else {
      createMutation.mutate(contratoData);
    }
  };

  const handleDelete = (contrato: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar exclusão",
      description: `Tem certeza que deseja excluir o contrato "${contrato.numeroContrato || contrato.numeroTitulo}"?`,
      onConfirm: () => {
        deleteMutation.mutate(contrato.id);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  // Usar dados reais se disponíveis, senão usar dados de exemplo
  const displayContratos = contratos || contratosData;

  // Filtrar contratos por termo de busca
  const filteredContratos = displayContratos.filter(contrato => 
    (contrato.numeroContrato && contrato.numeroContrato.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contrato.numeroTitulo && contrato.numeroTitulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contrato.fornecedor && contrato.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contrato.valorParcela && contrato.valorParcela.toString().includes(searchTerm))
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: "Ativo", variant: "default" as const, className: "bg-green-100 text-green-800" },
      inativo: { label: "Inativo", variant: "secondary" as const, className: "bg-red-100 text-red-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="text-center">Carregando...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Contratos</h1>
            <p className="text-slate-600">Gerenciar contratos e gerar parcelas</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Contrato
            </Button>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Usuário</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Empresa <span className="text-red-500">*</span>
            </label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-blue-500">
              <option>BPrint</option>
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pesquisar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por descrição, número, fornecedor ou valor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <Tabs defaultValue="todos" className="w-full">
            <div className="border-b border-slate-200 px-4 py-2">
              <TabsList className="grid w-full grid-cols-3 bg-transparent border-none">
                <TabsTrigger value="todos" className="flex items-center space-x-2 data-[state=active]:bg-slate-100">
                  <div className="w-4 h-4 border border-slate-400 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-600 rounded-sm"></div>
                  </div>
                  <span>Todos ({filteredContratos.length})</span>
                </TabsTrigger>
                <TabsTrigger value="ativos" className="flex items-center space-x-2 data-[state=active]:bg-slate-100">
                  <div className="w-4 h-4 border border-slate-400 rounded-full"></div>
                  <span>Ativos ({filteredContratos.filter(c => c.status === 'ativo').length})</span>
                </TabsTrigger>
                <TabsTrigger value="inativos" className="flex items-center space-x-2 data-[state=active]:bg-slate-100">
                  <div className="w-4 h-4 border border-slate-400 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-sm"></div>
                  </div>
                  <span>Desativados ({filteredContratos.filter(c => c.status === 'inativo').length})</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="todos" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-medium text-slate-700">Número do Título</TableHead>
                    <TableHead className="font-medium text-slate-700">Fornecedor</TableHead>
                    <TableHead className="font-medium text-slate-700">Nº de Parcelas</TableHead>
                    <TableHead className="font-medium text-slate-700">Dia Venc.</TableHead>
                    <TableHead className="font-medium text-slate-700">Valor da Parcela</TableHead>
                    <TableHead className="font-medium text-slate-700">Status</TableHead>
                    <TableHead className="text-center font-medium text-slate-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContratos.map((contrato) => (
                    <TableRow key={contrato.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">
                        {contrato.numeroTitulo || contrato.numeroContrato}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        {contrato.fornecedor}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {contrato.numeroParcelas}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {contrato.diaVencimento}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        <div>
                          <div className="font-medium">{formatCurrency(contrato.valorParcela || contrato.valorMensal)}</div>
                          <div className="text-xs text-slate-500">Valor da Parcela</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(contrato.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <Copy className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <DollarSign className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-red-50"
                            onClick={() => handleDelete(contrato)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="ativos" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-medium text-slate-700">Número do Título</TableHead>
                    <TableHead className="font-medium text-slate-700">Fornecedor</TableHead>
                    <TableHead className="font-medium text-slate-700">Nº de Parcelas</TableHead>
                    <TableHead className="font-medium text-slate-700">Dia Venc.</TableHead>
                    <TableHead className="font-medium text-slate-700">Valor da Parcela</TableHead>
                    <TableHead className="font-medium text-slate-700">Status</TableHead>
                    <TableHead className="text-center font-medium text-slate-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContratos.filter(c => c.status === 'ativo').map((contrato) => (
                    <TableRow key={contrato.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">
                        {contrato.numeroTitulo || contrato.numeroContrato}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        {contrato.fornecedor}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {contrato.numeroParcelas}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {contrato.diaVencimento}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        <div>
                          <div className="font-medium">{formatCurrency(contrato.valorParcela || contrato.valorMensal)}</div>
                          <div className="text-xs text-slate-500">Valor da Parcela</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(contrato.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <Copy className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <DollarSign className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-red-50"
                            onClick={() => handleDelete(contrato)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="inativos" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-medium text-slate-700">Número do Título</TableHead>
                    <TableHead className="font-medium text-slate-700">Fornecedor</TableHead>
                    <TableHead className="font-medium text-slate-700">Nº de Parcelas</TableHead>
                    <TableHead className="font-medium text-slate-700">Dia Venc.</TableHead>
                    <TableHead className="font-medium text-slate-700">Valor da Parcela</TableHead>
                    <TableHead className="font-medium text-slate-700">Status</TableHead>
                    <TableHead className="text-center font-medium text-slate-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContratos.filter(c => c.status === 'inativo').map((contrato) => (
                    <TableRow key={contrato.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">
                        {contrato.numeroTitulo || contrato.numeroContrato}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        {contrato.fornecedor}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {contrato.numeroParcelas}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {contrato.diaVencimento}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        <div>
                          <div className="font-medium">{formatCurrency(contrato.valorParcela || contrato.valorMensal)}</div>
                          <div className="text-xs text-slate-500">Valor da Parcela</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(contrato.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <Copy className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <DollarSign className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-red-50"
                            onClick={() => handleDelete(contrato)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modal de Contrato */}
        <ContratoModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          contrato={editingContrato}
          onSave={handleSave}
        />

        {/* Diálogo de Confirmação */}
        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
        />
      </main>
    </div>
  );
}