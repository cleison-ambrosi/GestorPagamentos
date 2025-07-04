import { useQuery } from "@tanstack/react-query";
import { fetchEmpresas } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Bell, User, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";

// Dados de exemplo das empresas
const empresasData = [
  { id: 1, nome: "CL2G", cnpj: null, createdAt: "2025-07-02" },
  { id: 2, nome: "Wingraph", cnpj: null, createdAt: "2025-07-02" },
  { id: 3, nome: "Bremen", cnpj: null, createdAt: "2025-07-02" },
  { id: 4, nome: "BPrint", cnpj: null, createdAt: "2025-07-02" }
];

export default function Empresas() {
  const { data: empresas, isLoading } = useQuery({
    queryKey: ['/api/empresas'],
    queryFn: fetchEmpresas
  });

  // Usando dados de exemplo enquanto não há dados reais
  const displayEmpresas = empresas && empresas.length > 0 ? empresas : empresasData;

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
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
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
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayEmpresas.map((empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell className="font-medium">
                        {String(empresa.id).padStart(2, '0')}
                      </TableCell>
                      <TableCell>{empresa.nome}</TableCell>
                      <TableCell>
                        <span className="text-orange-500">
                          {empresa.cnpj || "Não informado"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatDate(empresa.createdAt || new Date())}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
        </div>
      </main>
    </div>
  );
}
