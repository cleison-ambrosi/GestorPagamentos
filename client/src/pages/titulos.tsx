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
import TituloModal from "@/components/titulo-modal";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo dos títulos
const titulosData = [
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

export default function Titulos() {
  const { data: titulos, isLoading } = useQuery({
    queryKey: ["/api/titulos"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTitulo, setEditingTitulo] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {}
  });

  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/titulos", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      toast({
        title: "Sucesso",
        description: "Título criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar título. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/titulos/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      toast({
        title: "Sucesso",
        description: "Título atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar título. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/titulos/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      toast({
        title: "Sucesso",
        description: "Título excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir título. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleNew = () => {
    setEditingTitulo(null);
    setModalOpen(true);
  };

  const handleEdit = (titulo: any) => {
    setEditingTitulo(titulo);
    setModalOpen(true);
  };

  const handleDuplicate = (titulo: any) => {
    const duplicatedTitulo = {
      ...titulo,
      numeroTitulo: `${titulo.numeroTitulo}_copy`,
      id: undefined
    };
    setEditingTitulo(duplicatedTitulo);
    setModalOpen(true);
  };

  const handleSave = (tituloData: any) => {
    if (editingTitulo?.id) {
      updateMutation.mutate({ id: editingTitulo.id, data: tituloData });
    } else {
      createMutation.mutate(tituloData);
    }
  };

  const handleDelete = (titulo: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar exclusão",
      description: `Tem certeza que deseja excluir o título "${titulo.numeroTitulo}"?`,
      onConfirm: () => {
        deleteMutation.mutate(titulo.id);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  // Usar dados reais se disponíveis, senão usar dados de exemplo
  const displayTitulos = titulos || titulosData;

  // Filtrar títulos por termo de busca
  const filteredTitulos = displayTitulos.filter(titulo => 
    (titulo.numeroTitulo && titulo.numeroTitulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (titulo.fornecedor && titulo.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (titulo.valorParcela && titulo.valorParcela.toString().includes(searchTerm))
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: "Ativo", variant: "default" as const, className: "bg-green-100 text-green-800" },
      inativo: { label: "Inativo", variant: "secondary" as const, className: "bg-red-100 text-red-800" },
      pendente: { label: "Pendente", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      pago: { label: "Pago", variant: "default" as const, className: "bg-green-100 text-green-800" },
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
            <h1 className="text-2xl font-bold text-slate-800">Títulos</h1>
            <p className="text-slate-600">Gerenciar títulos a pagar</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Título
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
                  <span>Todos ({filteredTitulos.length})</span>
                </TabsTrigger>
                <TabsTrigger value="ativos" className="flex items-center space-x-2 data-[state=active]:bg-slate-100">
                  <div className="w-4 h-4 border border-slate-400 rounded-full"></div>
                  <span>Ativos ({filteredTitulos.filter(t => t.status === 'ativo' || t.status === 'pendente').length})</span>
                </TabsTrigger>
                <TabsTrigger value="inativos" className="flex items-center space-x-2 data-[state=active]:bg-slate-100">
                  <div className="w-4 h-4 border border-slate-400 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-sm"></div>
                  </div>
                  <span>Desativados ({filteredTitulos.filter(t => t.status === 'inativo').length})</span>
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
                  {filteredTitulos.map((titulo) => (
                    <TableRow key={titulo.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">
                        {titulo.numeroTitulo}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        {titulo.fornecedor}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {titulo.numeroParcelas || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {titulo.diaVencimento || (titulo.dataVencimento ? formatDate(titulo.dataVencimento) : "-")}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        <div>
                          <div className="font-medium">{formatCurrency(titulo.valorParcela || titulo.valor)}</div>
                          <div className="text-xs text-slate-500">Valor da Parcela</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(titulo.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleEdit(titulo)}
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleDuplicate(titulo)}
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
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleDelete(titulo)}
                          >
                            <Trash2 className="h-4 w-4 text-slate-600" />
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
                  {filteredTitulos.filter(t => t.status === 'ativo' || t.status === 'pendente').map((titulo) => (
                    <TableRow key={titulo.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">
                        {titulo.numeroTitulo}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        {titulo.fornecedor}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {titulo.numeroParcelas || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {titulo.diaVencimento || (titulo.dataVencimento ? formatDate(titulo.dataVencimento) : "-")}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        <div>
                          <div className="font-medium">{formatCurrency(titulo.valorParcela || titulo.valor)}</div>
                          <div className="text-xs text-slate-500">Valor da Parcela</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(titulo.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleEdit(titulo)}
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleDuplicate(titulo)}
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
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleDelete(titulo)}
                          >
                            <Trash2 className="h-4 w-4 text-slate-600" />
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
                  {filteredTitulos.filter(t => t.status === 'inativo').map((titulo) => (
                    <TableRow key={titulo.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">
                        {titulo.numeroTitulo}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        {titulo.fornecedor}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {titulo.numeroParcelas || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {titulo.diaVencimento || (titulo.dataVencimento ? formatDate(titulo.dataVencimento) : "-")}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        <div>
                          <div className="font-medium">{formatCurrency(titulo.valorParcela || titulo.valor)}</div>
                          <div className="text-xs text-slate-500">Valor da Parcela</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(titulo.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleEdit(titulo)}
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleDuplicate(titulo)}
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
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleDelete(titulo)}
                          >
                            <Trash2 className="h-4 w-4 text-slate-600" />
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

        {/* Modal de Título */}
        <TituloModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          titulo={editingTitulo}
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