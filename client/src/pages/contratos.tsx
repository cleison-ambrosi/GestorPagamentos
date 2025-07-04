import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Copy, User } from "lucide-react";
import { fetchContratos } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ContratoModal from "@/components/contrato-modal";
import ConfirmDialog from "@/components/confirm-dialog";
import Sidebar from "@/components/sidebar";

export default function Contratos() {
  const { toast } = useToast();
  const { data: contratos = [], isLoading } = useQuery({
    queryKey: ["/api/contratos"],
    queryFn: fetchContratos,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContrato, setEditingContrato] = useState<any>(null);
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

  const createContratoMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/contratos", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({ description: "Contrato criado com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao criar contrato", variant: "destructive" });
    }
  });

  const updateContratoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest(`/api/contratos/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({ description: "Contrato atualizado com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao atualizar contrato", variant: "destructive" });
    }
  });

  const deleteContratoMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/contratos/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({ description: "Contrato excluído com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao excluir contrato", variant: "destructive" });
    }
  });

  const handleSave = (data: any) => {
    if (editingContrato) {
      updateContratoMutation.mutate({ id: editingContrato.id, data });
    } else {
      createContratoMutation.mutate(data);
    }
    setEditingContrato(null);
    setModalOpen(false);
  };

  const handleEdit = (contrato: any) => {
    setEditingContrato(contrato);
    setModalOpen(true);
  };

  const handleDelete = (contrato: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar exclusão",
      description: `Tem certeza que deseja excluir o contrato "${contrato.numero}"?`,
      onConfirm: () => {
        deleteContratoMutation.mutate(contrato.id);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  const handleCopy = (contrato: any) => {
    const copy = { ...contrato, numero: `${contrato.numero} - Cópia` };
    delete copy.id;
    createContratoMutation.mutate(copy);
  };

  const filteredContratos = contratos.filter((contrato: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contrato.numero?.toLowerCase().includes(searchLower) ||
      contrato.descricao?.toLowerCase().includes(searchLower) ||
      contrato.valor?.toString().includes(searchLower) ||
      contrato.fornecedor?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        {/* Header Panel */}
        <div className="bg-white border-b border-slate-200 p-6 pl-[32px] pr-[32px] pt-[16px] pb-[16px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Contratos</h1>
              <p className="text-slate-600">Gerenciar contratos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => { setEditingContrato(null); setModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Contrato
              </Button>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Usuário</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">ID</TableHead>
                <TableHead className="font-medium text-slate-700">Número</TableHead>
                <TableHead className="font-medium text-slate-700">Descrição</TableHead>
                <TableHead className="font-medium text-slate-700">Fornecedor</TableHead>
                <TableHead className="font-medium text-slate-700">Valor</TableHead>
                <TableHead className="font-medium text-slate-700">Data Início</TableHead>
                <TableHead className="font-medium text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.map((contrato: any) => (
                <TableRow key={contrato.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{contrato.id.toString().padStart(5, '0')}</TableCell>
                  <TableCell className="font-medium">{contrato.numero}</TableCell>
                  <TableCell>{contrato.descricao}</TableCell>
                  <TableCell>{contrato.fornecedor || '-'}</TableCell>
                  <TableCell>{formatCurrency(contrato.valor || 0)}</TableCell>
                  <TableCell>{formatDate(contrato.dataInicio) || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(contrato)}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(contrato)}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Copy className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(contrato)}
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

        <ContratoModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          contrato={editingContrato}
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