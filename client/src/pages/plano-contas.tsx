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
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Plano de Contas</h2>
              <p className="text-slate-600">Gerenciar plano de contas</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="text-white text-sm" />
                </div>
                <span className="text-sm font-medium text-slate-700">Usuário</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Contas</h3>
                  <p className="text-sm text-slate-600">
                    {filteredContas.length} conta(s) encontrada(s)
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar contas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Conta Pai</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell className="font-medium">
                      {conta.codigo}
                    </TableCell>
                    <TableCell>
                      {conta.nome}
                    </TableCell>
                    <TableCell>
                      {conta.contaPai ? (
                        <span className="text-slate-600">{conta.contaPai}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(conta.dataCriacao || new Date())}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEdit(conta)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDuplicate(conta)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDelete(conta)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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