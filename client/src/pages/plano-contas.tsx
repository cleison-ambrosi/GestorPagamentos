import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, User } from "lucide-react";
import { fetchPlanoContas } from "@/lib/api";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PlanoContasModal from "@/components/plano-contas-modal";
import ConfirmDialog from "@/components/confirm-dialog";
import Sidebar from "@/components/sidebar";

export default function PlanoContas() {
  const { toast } = useToast();
  const { data: planoContas = [], isLoading } = useQuery({
    queryKey: ["/api/plano-contas"],
    queryFn: fetchPlanoContas,
  });


  const [modalOpen, setModalOpen] = useState(false);
  const [editingConta, setEditingConta] = useState<any>(null);
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

  const createContaMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/plano-contas", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plano-contas"] });
      toast({ description: "Conta criada com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao criar conta", variant: "destructive" });
    }
  });

  const updateContaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest(`/api/plano-contas/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plano-contas"] });
      toast({ description: "Conta atualizada com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao atualizar conta", variant: "destructive" });
    }
  });

  const deleteContaMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/plano-contas/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plano-contas"] });
      toast({ description: "Conta excluída com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao excluir conta", variant: "destructive" });
    }
  });

  const handleSave = (data: any) => {
    if (editingConta) {
      updateContaMutation.mutate({ id: editingConta.id, data });
    } else {
      createContaMutation.mutate(data);
    }
    setEditingConta(null);
    setModalOpen(false);
  };

  const handleEdit = (conta: any) => {
    setEditingConta(conta);
    setModalOpen(true);
  };

  const handleDelete = (conta: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar exclusão",
      description: `Tem certeza que deseja excluir a conta "${conta.nome}"?`,
      onConfirm: () => {
        deleteContaMutation.mutate(conta.id);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  const filteredContas = planoContas || [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        {/* Header Panel */}
        <div className="bg-white border-b border-slate-200 p-6 pt-[13px] pb-[13px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Plano de Contas</h1>
              <p className="text-slate-600">Gerenciar plano de contas</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => { setEditingConta(null); setModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
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
                <TableHead className="font-medium text-slate-700">Código</TableHead>
                <TableHead className="font-medium text-slate-700">Nome</TableHead>
                <TableHead className="font-medium text-slate-700">Conta Pai</TableHead>
                <TableHead className="font-medium text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContas.map((conta: any) => (
                <TableRow key={conta.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{conta.id.toString().padStart(5, '0')}</TableCell>
                  <TableCell className="font-medium">{conta.codigo}</TableCell>
                  <TableCell>{conta.nome}</TableCell>
                  <TableCell>{conta.contaPai || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(conta)}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(conta)}
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

        <PlanoContasModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          conta={editingConta}
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