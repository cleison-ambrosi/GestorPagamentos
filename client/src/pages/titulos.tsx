import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, X, Copy, Receipt } from "lucide-react";
import { fetchTitulos, fetchEmpresas } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TituloModal from "@/components/titulo-modal";
import ConfirmDialog from "@/components/confirm-dialog";
import Sidebar from "@/components/sidebar";

export default function Titulos() {
  const { toast } = useToast();
  const { data: titulos = [], isLoading } = useQuery({
    queryKey: ["/api/titulos"],
    queryFn: fetchTitulos,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ["/api/empresas"],
    queryFn: fetchEmpresas,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState(() => {
    // Recupera a última empresa selecionada do localStorage
    return localStorage.getItem('titulos-empresa-filter') || "all";
  });

  // Salva a empresa selecionada no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('titulos-empresa-filter', empresaFilter);
  }, [empresaFilter]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTitulo, setEditingTitulo] = useState<any>(null);
  const [baixaModalOpen, setBaixaModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const createTituloMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/titulos", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      toast({ description: "Título criado com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao criar título", variant: "destructive" });
    }
  });

  const updateTituloMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest(`/api/titulos/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      toast({ description: "Título atualizado com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao atualizar título", variant: "destructive" });
    }
  });

  const cancelTituloMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/titulos/${id}`, "PUT", { status: 4 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      toast({ description: "Título cancelado com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao cancelar título", variant: "destructive" });
    }
  });



  const handleSave = (data: any) => {
    if (editingTitulo && editingTitulo.id) {
      updateTituloMutation.mutate({ id: editingTitulo.id, data });
    } else {
      createTituloMutation.mutate(data);
    }
    setEditingTitulo(null);
    setModalOpen(false);
  };

  const handleEdit = (titulo: any) => {
    setEditingTitulo(titulo);
    setModalOpen(true);
  };

  const handleBaixa = (titulo: any) => {
    setEditingTitulo(titulo);
    setBaixaModalOpen(true);
  };

  const handleCancel = (titulo: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar cancelamento",
      description: `Tem certeza que deseja cancelar o título "${titulo.numeroTitulo}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        cancelTituloMutation.mutate(titulo.id);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  const handleCopy = (titulo: any) => {
    const copy = { ...titulo, numeroTitulo: `${titulo.numeroTitulo} - Cópia` };
    delete copy.id;
    createTituloMutation.mutate(copy);
  };

  const filteredTitulos = titulos.filter((titulo: any) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || (
      titulo.numeroTitulo?.toLowerCase().includes(term) ||
      titulo.descricao?.toLowerCase().includes(term) ||
      titulo.valor?.toString().includes(term) ||
      titulo.fornecedor?.toLowerCase().includes(term) ||
      titulo.observacoes?.toLowerCase().includes(term)
    );
    
    const matchesEmpresa = empresaFilter === "all" || titulo.idEmpresa?.toString() === empresaFilter;
    
    return matchesSearch && matchesEmpresa;
  });

  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span> : 
        part
    );
  };

  const getStatusBadge = (status: string | number) => {
    const numStatus = typeof status === 'string' ? parseInt(status) : status;
    switch (numStatus) {
      case 1:
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Em Aberto</Badge>;
      case 2:
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Parcial</Badge>;
      case 3:
        return <Badge variant="default" className="bg-green-100 text-green-800">Pago</Badge>;
      case 4:
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Em Aberto</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-56">
        {/* Header Panel */}
        <div className="bg-white border-b border-slate-200 p-6 pt-[16px] pb-[16px] pl-[32px] pr-[32px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Títulos</h1>
              <p className="text-slate-600">Gerenciar títulos a pagar</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => { 
                  // Auto-popular empresa se há filtro ativo
                  const novoTitulo = empresaFilter !== "all" ? { idEmpresa: parseInt(empresaFilter) } : null;
                  setEditingTitulo(novoTitulo); 
                  setModalOpen(true); 
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Título
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Filtros */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Empresa
                </label>
                <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                  <SelectTrigger className="w-full">
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pesquisar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar por número, descrição ou fornecedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <div className="bg-slate-50 rounded-lg p-3 border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Títulos:</div>
                      <div className="font-semibold text-sm text-slate-800">
                        {filteredTitulos.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Total Saldo:</div>
                      <div className="font-semibold text-sm text-slate-800">
                        {formatCurrency(
                          filteredTitulos.reduce((total, titulo) => 
                            total + parseFloat(titulo.saldoPagar || titulo.valorTotal || '0'), 0
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">Vencimento</TableHead>
                <TableHead className="font-medium text-slate-700">Número Título</TableHead>
                <TableHead className="font-medium text-slate-700">Fornecedor</TableHead>
                <TableHead className="font-medium text-slate-700 text-right">Valor Total</TableHead>
                <TableHead className="font-medium text-slate-700 text-right">Saldo a Pagar</TableHead>
                <TableHead className="font-medium text-slate-700">Status</TableHead>
                <TableHead className="font-medium text-slate-700 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTitulos.map((titulo: any) => (
                <TableRow key={titulo.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleEdit(titulo)}>
                  <TableCell>{titulo.vencimento ? formatDate(new Date(titulo.vencimento)) : '-'}</TableCell>
                  <TableCell className="font-medium">{highlightText(titulo.numeroTitulo, searchTerm)}</TableCell>
                  <TableCell>{titulo.fornecedor ? highlightText(titulo.fornecedor, searchTerm) : '-'}</TableCell>
                  <TableCell className="text-right">{formatCurrency(parseFloat(titulo.valorTotal || '0'))}</TableCell>
                  <TableCell className="text-right">{formatCurrency(parseFloat(titulo.saldoPagar || titulo.valorTotal || '0'))}</TableCell>
                  <TableCell>{getStatusBadge(titulo.status || 'Em Aberto')}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {titulo.status !== 4 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(titulo);
                          }}
                          className="h-8 w-8 p-0 hover:bg-slate-100"
                          title="Editar título"
                        >
                          <Edit className="h-4 w-4 text-slate-600" />
                        </Button>
                      )}
                      {titulo.status !== 4 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBaixa(titulo);
                          }}
                          className="h-8 w-8 p-0 hover:bg-slate-100"
                          title="Lançar baixa"
                        >
                          <Receipt className="h-4 w-4 text-slate-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(titulo);
                        }}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                        title="Copiar título"
                      >
                        <Copy className="h-4 w-4 text-slate-600" />
                      </Button>
                      {titulo.status !== 4 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(titulo);
                          }}
                          className="h-8 w-8 p-0 hover:bg-slate-100"
                          title="Cancelar título"
                        >
                          <X className="h-4 w-4 text-slate-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>

        <TituloModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          titulo={editingTitulo}
          onSave={handleSave}
        />

        <TituloModal
          open={baixaModalOpen}
          onOpenChange={setBaixaModalOpen}
          titulo={editingTitulo}
          onSave={handleSave}
          showBaixaTab={true}
        />

        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
        />
      </main>
    </div>
  );
}