import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Copy } from "lucide-react";
import { fetchTitulos } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTitulo, setEditingTitulo] = useState<any>(null);
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

  const deleteTituloMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/titulos/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/titulos"] });
      toast({ description: "Título excluído com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao excluir título", variant: "destructive" });
    }
  });

  const handleSave = (data: any) => {
    if (editingTitulo) {
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

  const handleDelete = (titulo: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar exclusão",
      description: `Tem certeza que deseja excluir o título "${titulo.numeroTitulo}"?`,
      onConfirm: () => {
        deleteTituloMutation.mutate(titulo.id);
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
    const searchLower = searchTerm.toLowerCase();
    return (
      titulo.numeroTitulo?.toLowerCase().includes(searchLower) ||
      titulo.descricao?.toLowerCase().includes(searchLower) ||
      titulo.valor?.toString().includes(searchLower) ||
      titulo.fornecedor?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Pendente</Badge>;
      case 'pago':
        return <Badge variant="outline" className="text-green-600 border-green-600">Pago</Badge>;
      case 'vencido':
        return <Badge variant="outline" className="text-red-600 border-red-600">Vencido</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-600 border-slate-600">Ativo</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        {/* Header Panel */}
        <div className="bg-white border-b border-slate-200 p-6 pt-[16px] pb-[16px] pl-[32px] pr-[32px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Títulos</h1>
              <p className="text-slate-600">Gerenciar títulos a pagar</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => { setEditingTitulo(null); setModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Título
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">ID</TableHead>
                <TableHead className="font-medium text-slate-700">Número do Título</TableHead>
                <TableHead className="font-medium text-slate-700">Fornecedor</TableHead>
                <TableHead className="font-medium text-slate-700">Vencimento</TableHead>
                <TableHead className="font-medium text-slate-700">Valor</TableHead>
                <TableHead className="font-medium text-slate-700">Status</TableHead>
                <TableHead className="font-medium text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTitulos.map((titulo: any) => (
                <TableRow key={titulo.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{titulo.id.toString().padStart(5, '0')}</TableCell>
                  <TableCell className="font-medium">{titulo.numeroTitulo}</TableCell>
                  <TableCell>{titulo.fornecedor || '-'}</TableCell>
                  <TableCell>{titulo.dataVencimento || '-'}</TableCell>
                  <TableCell>{formatCurrency(titulo.valor || 0)}</TableCell>
                  <TableCell>{getStatusBadge(titulo.status || 'ativo')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(titulo)}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(titulo)}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Copy className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(titulo)}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Trash2 className="h-4 w-4 text-slate-500" />
                      </Button>
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