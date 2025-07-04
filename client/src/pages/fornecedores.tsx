import { useQuery } from "@tanstack/react-query";
import { fetchFornecedores } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Bell, User, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";

// Dados de exemplo dos fornecedores
const fornecedoresData = [
  { id: 1, nome: "Viena Updated", email: "updated@teste.com", telefone: "123456789" },
  { id: 2, nome: "Tech Solutions Ltda", email: "contato@techsolutions.com", telefone: "(11) 2345-6789" },
  { id: 3, nome: "Papelaria Central", email: "vendas@papelariacentral.com", telefone: "(11) 3456-7890" },
  { id: 4, nome: "Energia SP", email: "atendimento@energiasp.com", telefone: "0800-123-456" }
];

export default function Fornecedores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  const { data: fornecedores, isLoading } = useQuery({
    queryKey: ['/api/fornecedores'],
    queryFn: fetchFornecedores
  });

  // Usando dados de exemplo enquanto não há dados reais
  const displayFornecedores = fornecedores && fornecedores.length > 0 ? fornecedores : fornecedoresData;

  const handleEdit = (fornecedor: any) => {
    setEditingFornecedor(fornecedor);
    setNome(fornecedor.nome);
    setEmail(fornecedor.email || "");
    setTelefone(fornecedor.telefone || "");
    setEndereco(fornecedor.endereco || "");
    setObservacoes(fornecedor.observacoes || "");
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingFornecedor(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setObservacoes("");
    setModalOpen(true);
  };

  const handleSave = () => {
    console.log("Salvando fornecedor:", { nome, email, telefone, endereco, observacoes });
    setModalOpen(false);
  };

  const filteredFornecedores = displayFornecedores.filter((fornecedor: any) =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.telefone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Fornecedores</h2>
              <p className="text-slate-600">Gerenciar fornecedores</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
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
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFornecedores.map((fornecedor: any) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell className="font-medium">
                        {String(fornecedor.id).padStart(5, '0')}
                      </TableCell>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>
                        <a 
                          href={`mailto:${fornecedor.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {fornecedor.email}
                        </a>
                      </TableCell>
                      <TableCell>{fornecedor.telefone}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(fornecedor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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

          {/* Modal de Edição de Fornecedor */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Fornecedor</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Altere os dados do fornecedor conforme necessário
                </p>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Fornecedor *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do fornecedor"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
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
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Endereço completo"
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações adicionais"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={!nome.trim()}
                  className="w-full"
                >
                  Salvar Fornecedor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
