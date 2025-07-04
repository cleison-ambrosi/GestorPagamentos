import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPlanoContas } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Bell, User, Edit, Copy, Trash2, Search } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useState } from "react";
import ConfirmDialog from "@/components/confirm-dialog";
import PlanoContasModal from "@/components/plano-contas-modal";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo do plano de contas
const planoContasData = [
  { id: 1, codigo: "1", nome: "Principal", contaPai: null, dataCriacao: "2025-06-25" },
  { id: 2, codigo: "1.01.001", nome: "Conta Teste", contaPai: "1 - Principal", dataCriacao: "2025-06-25" }
];

export default function PlanoContas() {
  const { data: planoContas, isLoading } = useQuery({
    queryKey: ["/api/plano-contas"],
    queryFn: fetchPlanoContas
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConta, setEditingConta] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {}
  });

  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/plano-contas", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plano-contas"] });
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/plano-contas/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plano-contas"] });
      toast({
        title: "Sucesso",
        description: "Conta atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar conta. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/plano-contas/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plano-contas"] });
      toast({
        title: "Sucesso",
        description: "Conta excluída com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir conta. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleNew = () => {
    setEditingConta(null);
    setModalOpen(true);
  };

  const handleEdit = (conta: any) => {
    setEditingConta(conta);
    setModalOpen(true);
  };

  const handleDuplicate = (conta: any) => {
    const duplicatedConta = {
      ...conta,
      codigo: `${conta.codigo}_copy`,
      nome: `${conta.nome} (Cópia)`,
      id: undefined
    };
    setEditingConta(duplicatedConta);
    setModalOpen(true);
  };

  const handleSave = (contaData: any) => {
    if (editingConta?.id) {
      updateMutation.mutate({ id: editingConta.id, data: contaData });
    } else {
      createMutation.mutate(contaData);
    }
  };

  const handleDelete = (conta: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar exclusão",
      description: `Tem certeza que deseja excluir a conta "${conta.nome}"?`,
      onConfirm: () => {
        deleteMutation.mutate(conta.id);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  // Usar dados reais se disponíveis, senão usar dados de exemplo
  const displayContas = planoContas || planoContasData;

  // Filtrar contas por termo de busca
  const filteredContas = displayContas.filter(conta => 
    conta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conta.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-slate-800">Plano de Contas</h1>
            <p className="text-slate-600">Gerenciar plano de contas</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Usuário</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por código ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full max-w-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">ID</TableHead>
                <TableHead className="font-medium text-slate-700">Código</TableHead>
                <TableHead className="font-medium text-slate-700">Nome</TableHead>
                <TableHead className="font-medium text-slate-700">Conta Pai</TableHead>
                <TableHead className="text-center font-medium text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContas.map((conta, index) => (
                <TableRow key={conta.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-600">
                    {String(index + 1).padStart(5, '0')}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {conta.codigo}
                  </TableCell>
                  <TableCell className="text-slate-900">
                    {conta.nome}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {conta.contaPai ? conta.contaPai : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-slate-100"
                        onClick={() => handleEdit(conta)}
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-slate-100"
                        onClick={() => handleDuplicate(conta)}
                      >
                        <Copy className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-red-50"
                        onClick={() => handleDelete(conta)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal de Plano de Contas */}
        <PlanoContasModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          conta={editingConta}
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