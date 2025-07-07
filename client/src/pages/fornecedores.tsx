import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFornecedores } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Bell, User, Edit, Trash2, Search, Copy } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/confirm-dialog";

export default function Fornecedores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {}
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: fornecedores, isLoading } = useQuery({
    queryKey: ['/api/fornecedores'],
    queryFn: fetchFornecedores
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/fornecedores', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fornecedores'] });
      toast({ description: 'Fornecedor criado com sucesso!' });
      setModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ description: 'Erro ao criar fornecedor', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/fornecedores/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fornecedores'] });
      toast({ description: 'Fornecedor atualizado com sucesso!' });
      setModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ description: 'Erro ao atualizar fornecedor', variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/fornecedores/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fornecedores'] });
      toast({ description: 'Fornecedor excluído com sucesso!' });
    },
    onError: () => {
      toast({ description: 'Erro ao excluir fornecedor', variant: 'destructive' });
    }
  });



  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setObservacoes("");
    setEditingFornecedor(null);
  };

  const handleEdit = (fornecedor: any) => {
    setEditingFornecedor(fornecedor);
    setNome(fornecedor.nome);
    setEmail(fornecedor.email || "");
    setTelefone(fornecedor.telefone || "");
    setObservacoes(fornecedor.observacoes || "");
    setModalOpen(true);
  };

  const handleDelete = (fornecedor: any) => {
    console.log('Excluindo fornecedor:', fornecedor.id);
    setConfirmDialog({
      open: true,
      title: "Confirmar exclusão",
      description: `Tem certeza que deseja excluir o fornecedor "${fornecedor.nome}"?`,
      onConfirm: () => {
        deleteMutation.mutate(fornecedor.id);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleSave = () => {
    const data = {
      nome,
      email,
      telefone,
      observacoes
    };

    console.log('Salvando fornecedor:', data);

    if (editingFornecedor) {
      updateMutation.mutate({ id: editingFornecedor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleDuplicate = (fornecedor: any) => {
    setEditingFornecedor(null);
    setNome(fornecedor.nome + " (Cópia)");
    setEmail(fornecedor.email || "");
    setTelefone(fornecedor.telefone || "");
    setObservacoes(fornecedor.observacoes || "");
    setModalOpen(true);
  };

  const filteredFornecedores = fornecedores?.filter((fornecedor: any) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    const nome = fornecedor.nome?.toLowerCase() || '';
    const email = fornecedor.email?.toLowerCase() || '';
    const telefone = fornecedor.telefone?.toLowerCase() || '';
    const observacoes = fornecedor.observacoes?.toLowerCase() || '';
    
    return nome.includes(term) || email.includes(term) || telefone.includes(term) || observacoes.includes(term);
  }) || [];

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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-56">
        {/* Header Panel */}
        <div className="bg-white border-b border-slate-200 p-6 pt-[16px] pb-[16px] pl-[32px] pr-[32px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Fornecedores</h1>
              <p className="text-slate-600">Gerenciar fornecedores</p>
            </div>
            <div className="flex items-center">
              <Button 
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Buscar fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-medium text-slate-700">ID</TableHead>
                  <TableHead className="font-medium text-slate-700">Nome</TableHead>
                  <TableHead className="font-medium text-slate-700">Email</TableHead>
                  <TableHead className="font-medium text-slate-700">Telefone</TableHead>
                  <TableHead className="font-medium text-slate-700 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-slate-500">Carregando...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredFornecedores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-slate-500">Nenhum fornecedor encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFornecedores.map((fornecedor: any) => (
                    <TableRow key={fornecedor.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleEdit(fornecedor)}>
                      <TableCell className="font-medium">{fornecedor.id.toString().padStart(5, '0')}</TableCell>
                      <TableCell className="font-medium">{highlightText(fornecedor.nome, searchTerm)}</TableCell>
                      <TableCell className="text-slate-600">{fornecedor.email ? highlightText(fornecedor.email, searchTerm) : '-'}</TableCell>
                      <TableCell className="text-slate-600">{fornecedor.telefone ? highlightText(fornecedor.telefone, searchTerm) : '-'}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(fornecedor);
                            }}
                            className="h-8 w-8 p-0 hover:bg-slate-100"
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(fornecedor);
                            }}
                            className="h-8 w-8 p-0 hover:bg-slate-100"
                          >
                            <Copy className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(fornecedor);
                            }}
                            className="h-8 w-8 p-0 hover:bg-slate-100"
                          >
                            <Trash2 className="h-4 w-4 text-slate-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do fornecedor"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre o fornecedor"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!nome || createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  );
}