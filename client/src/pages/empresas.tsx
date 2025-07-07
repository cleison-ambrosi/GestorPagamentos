import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEmpresas } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, User, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useState } from "react";
import ConfirmDialog from "@/components/confirm-dialog";



export default function Empresas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<any>(null);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {}
  });

  const queryClient = useQueryClient();

  const { data: empresas, isLoading } = useQuery({
    queryKey: ['/api/empresas'],
    queryFn: fetchEmpresas
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/empresas', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/empresas'] });
      setModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/empresas/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/empresas'] });
      setModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/empresas/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/empresas'] });
    }
  });

  const handleEdit = (empresa: any) => {
    setEditingEmpresa(empresa);
    setId(empresa.id.toString());
    setNome(empresa.nome);
    setApelido(empresa.apelido || "");
    setCnpj(empresa.cnpj || "");
    setTelefone(empresa.telefone || "");
    setEmail(empresa.email || "");
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingEmpresa(null);
    setId("");
    setNome("");
    setApelido("");
    setCnpj("");
    setTelefone("");
    setEmail("");
    setModalOpen(true);
  };

  const handleSave = () => {
    const empresaData = { nome, apelido, cnpj, telefone, email };
    
    console.log("Salvando empresa:", empresaData);
    
    if (editingEmpresa) {
      updateMutation.mutate({ id: parseInt(id), data: empresaData });
    } else {
      createMutation.mutate(empresaData);
    }
  };

  const handleDelete = (empresa: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar Exclusão",
      description: `Tem certeza que deseja excluir a empresa "${empresa.nome}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        console.log("Excluindo empresa:", empresa.id);
        deleteMutation.mutate(empresa.id);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Empresas</h2>
              <p className="text-slate-600">Gerenciar empresas cadastradas</p>
            </div>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-medium text-slate-700">ID</TableHead>
                    <TableHead className="font-medium text-slate-700">Nome</TableHead>
                    <TableHead className="font-medium text-slate-700">Apelido</TableHead>
                    <TableHead className="font-medium text-slate-700">CNPJ</TableHead>
                    <TableHead className="text-center font-medium text-slate-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empresas?.map((empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell className="font-medium">
                        {String(empresa.id).padStart(2, '0')}
                      </TableCell>
                      <TableCell>{empresa.nome}</TableCell>
                      <TableCell className="text-slate-600">
                        {empresa.apelido || "-"}
                      </TableCell>
                      <TableCell>
                        <span className="text-orange-500">
                          {empresa.cnpj || "Não informado"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(empresa)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDelete(empresa)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Modal de Edição de Empresa */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Empresa</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Altere os dados da empresa conforme necessário
                </p>
              </DialogHeader>

              <div className="space-y-4">
                {editingEmpresa && (
                  <div>
                    <Label htmlFor="id">ID *</Label>
                    <Input
                      id="id"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      placeholder="ID da empresa"
                      type="number"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="nome">Nome da Empresa *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <Label htmlFor="apelido">Apelido</Label>
                  <Input
                    id="apelido"
                    value={apelido}
                    onChange={(e) => setApelido(e.target.value)}
                    placeholder="Apelido ou nome fantasia"
                  />
                </div>

                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0000-00"
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="empresa@exemplo.com"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={!nome.trim() || (editingEmpresa && !id.trim())}
                  className="w-full"
                >
                  Salvar Empresa
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Diálogo de Confirmação */}
          <ConfirmDialog
            open={confirmDialog.open}
            onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
            title={confirmDialog.title}
            description={confirmDialog.description}
            onConfirm={confirmDialog.onConfirm}
          />
        </div>
      </main>
    </div>
  );
}
