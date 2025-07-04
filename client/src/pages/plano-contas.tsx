import { useQuery } from "@tanstack/react-query";
import { fetchPlanoContas } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Bell, User, Edit, Copy, Trash2, Search } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useState } from "react";

// Dados de exemplo do plano de contas
const planoContasData = [
  { id: 1, codigo: "1", nome: "Principal", contaPai: null, dataCriacao: "2025-06-25" },
  { id: 2, codigo: "1.01.001", nome: "Conta Teste", contaPai: "1 - Principal", dataCriacao: "2025-06-25" }
];

export default function PlanoContas() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: planoContas, isLoading } = useQuery({
    queryKey: ['/api/plano-contas'],
    queryFn: fetchPlanoContas
  });

  // Usando dados de exemplo enquanto não há dados reais
  const displayPlanoContas = planoContas && planoContas.length > 0 ? planoContas : planoContasData;

  const filteredPlanoContas = displayPlanoContas.filter(conta =>
    conta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conta.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (conta: any) => {
    if (window.confirm(`Tem certeza que deseja excluir a conta "${conta.nome}"?`)) {
      console.log("Excluindo conta:", conta.id);
      // Implementar exclusão aqui
    }
  };

  const handleDuplicate = (conta: any) => {
    console.log("Duplicando conta:", conta);
    // Implementar duplicação aqui
  };

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
              <Button>
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
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por código ou nome..."
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
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Conta Pai</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlanoContas.map((conta) => (
                    <TableRow key={conta.id}>
                      <TableCell className="font-medium">{conta.codigo}</TableCell>
                      <TableCell>{conta.nome}</TableCell>
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
