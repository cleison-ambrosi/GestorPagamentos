import { useQuery } from "@tanstack/react-query";
import { fetchTitulos } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, User, Eye, Edit, Trash2, DollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { useState } from "react";

// Dados de exemplo dos títulos
const titulosData = [
  {
    id: 1,
    numeroTitulo: "TIT-001",
    empresa: "CL2G",
    fornecedor: "Tech Solutions Ltda",
    descricao: "Desenvolvimento software - Julho",
    valor: 5000,
    dataVencimento: "2025-07-30",
    status: "em_atraso"
  },
  {
    id: 2,
    numeroTitulo: "TIT-002",
    empresa: "Wingraph",
    fornecedor: "Papelaria Central",
    descricao: "Material escritório - Agosto",
    valor: 800,
    dataVencimento: "2025-08-04",
    status: "vence_hoje"
  },
  {
    id: 3,
    numeroTitulo: "TIT-003",
    empresa: "Bremen",
    fornecedor: "Energia SP",
    descricao: "Energia elétrica - Agosto",
    valor: 1200,
    dataVencimento: "2025-08-15",
    status: "pendente"
  },
  {
    id: 4,
    numeroTitulo: "TIT-004",
    empresa: "BPrint",
    fornecedor: "Tech Solutions Ltda",
    descricao: "Manutenção sistemas - Julho",
    valor: 2500,
    dataVencimento: "2025-07-15",
    status: "pago"
  }
];

export default function Titulos() {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [empresaFilter, setEmpresaFilter] = useState("todas");
  
  const { data: titulos, isLoading } = useQuery({
    queryKey: ['/api/titulos'],
    queryFn: fetchTitulos
  });

  // Usando dados de exemplo enquanto não há dados reais
  const displayTitulos = titulos && titulos.length > 0 ? titulos : titulosData;

  const filteredTitulos = displayTitulos.filter((titulo: any) => {
    if (statusFilter !== "todos" && titulo.status !== statusFilter) return false;
    if (empresaFilter !== "todas" && titulo.empresa !== empresaFilter) return false;
    return true;
  });

  const titulosEmAtraso = filteredTitulos.filter((t: any) => t.status === "em_atraso");
  const titulosVenceHoje = filteredTitulos.filter((t: any) => t.status === "vence_hoje");
  const titulosPendentes = filteredTitulos.filter((t: any) => t.status === "pendente");
  const titulosPagos = filteredTitulos.filter((t: any) => t.status === "pago");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_atraso":
        return <Badge className="bg-red-100 text-red-800">Em Atraso</Badge>;
      case "vence_hoje":
        return <Badge className="bg-orange-100 text-orange-800">Vence Hoje</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "pago":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const TitulosTable = ({ data }: { data: any[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nº Título</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((titulo: any) => (
          <TableRow key={titulo.id}>
            <TableCell className="font-medium">
              {titulo.numeroTitulo}
            </TableCell>
            <TableCell>{titulo.empresa}</TableCell>
            <TableCell>{titulo.fornecedor}</TableCell>
            <TableCell className="max-w-xs truncate">
              {titulo.descricao}
            </TableCell>
            <TableCell>
              {formatCurrency(titulo.valor)}
            </TableCell>
            <TableCell>
              {formatDate(titulo.dataVencimento)}
            </TableCell>
            <TableCell>
              {getStatusBadge(titulo.status)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <DollarSign className="h-4 w-4" />
                </Button>
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
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Títulos</h2>
              <p className="text-slate-600">Gerenciar títulos a pagar</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Título
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
          {/* Filtros */}
          <div className="mb-6 flex space-x-4">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="em_atraso">Em Atraso</SelectItem>
                  <SelectItem value="vence_hoje">Vence Hoje</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Empresas</SelectItem>
                  <SelectItem value="CL2G">CL2G</SelectItem>
                  <SelectItem value="Wingraph">Wingraph</SelectItem>
                  <SelectItem value="Bremen">Bremen</SelectItem>
                  <SelectItem value="BPrint">BPrint</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Abas */}
          <Tabs defaultValue="todos" className="space-y-6">
            <TabsList>
              <TabsTrigger value="todos">
                Todos ({filteredTitulos.length})
              </TabsTrigger>
              <TabsTrigger value="em_atraso">
                Em Atraso ({titulosEmAtraso.length})
              </TabsTrigger>
              <TabsTrigger value="vence_hoje">
                Vence Hoje ({titulosVenceHoje.length})
              </TabsTrigger>
              <TabsTrigger value="pendente">
                Pendentes ({titulosPendentes.length})
              </TabsTrigger>
              <TabsTrigger value="pago">
                Pagos ({titulosPagos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Carregando...</p>
                  </div>
                ) : (
                  <TitulosTable data={filteredTitulos} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="em_atraso">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <TitulosTable data={titulosEmAtraso} />
              </div>
            </TabsContent>

            <TabsContent value="vence_hoje">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <TitulosTable data={titulosVenceHoje} />
              </div>
            </TabsContent>

            <TabsContent value="pendente">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <TitulosTable data={titulosPendentes} />
              </div>
            </TabsContent>

            <TabsContent value="pago">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <TitulosTable data={titulosPagos} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
