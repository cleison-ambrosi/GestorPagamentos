import { useQuery } from "@tanstack/react-query";
import { fetchContratos } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, User, Eye, Edit, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { useState } from "react";

// Dados de exemplo dos contratos
const contratosData = [
  {
    id: 1,
    empresa: "CL2G",
    fornecedor: "Tech Solutions Ltda",
    descricao: "Contrato de desenvolvimento de software",
    dataInicio: "2025-01-01",
    dataFim: "2025-12-31",
    valorMensal: 5000,
    status: "ativo",
    proximoVencimento: "2025-08-01"
  },
  {
    id: 2,
    empresa: "Wingraph",
    fornecedor: "Papelaria Central",
    descricao: "Fornecimento de material de escritório",
    dataInicio: "2025-02-01",
    dataFim: "2025-11-30",
    valorMensal: 800,
    status: "ativo",
    proximoVencimento: "2025-08-01"
  },
  {
    id: 3,
    empresa: "Bremen",
    fornecedor: "Energia SP",
    descricao: "Fornecimento de energia elétrica",
    dataInicio: "2024-12-01",
    dataFim: "2025-12-01",
    valorMensal: 1200,
    status: "cancelado",
    proximoVencimento: null
  }
];

export default function Contratos() {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [empresaFilter, setEmpresaFilter] = useState("todas");
  
  const { data: contratos, isLoading } = useQuery({
    queryKey: ['/api/contratos'],
    queryFn: fetchContratos
  });

  // Usando dados de exemplo enquanto não há dados reais
  const displayContratos = contratos && contratos.length > 0 ? contratos : contratosData;

  const filteredContratos = displayContratos.filter((contrato: any) => {
    if (statusFilter !== "todos" && contrato.status !== statusFilter) return false;
    if (empresaFilter !== "todas" && contrato.empresa !== empresaFilter) return false;
    return true;
  });

  const contratosAtivos = filteredContratos.filter((c: any) => c.status === "ativo");
  const contratosCancelados = filteredContratos.filter((c: any) => c.status === "cancelado");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "cancelado":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const ContratosTable = ({ data }: { data: any[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor Mensal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Próximo Vencimento</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((contrato: any) => (
          <TableRow key={contrato.id}>
            <TableCell className="font-medium">
              {String(contrato.id).padStart(3, '0')}
            </TableCell>
            <TableCell>{contrato.empresa}</TableCell>
            <TableCell>{contrato.fornecedor}</TableCell>
            <TableCell className="max-w-xs truncate">
              {contrato.descricao}
            </TableCell>
            <TableCell>
              {formatCurrency(contrato.valorMensal)}
            </TableCell>
            <TableCell>
              {getStatusBadge(contrato.status)}
            </TableCell>
            <TableCell>
              {contrato.proximoVencimento ? 
                formatDate(contrato.proximoVencimento) : 
                <span className="text-slate-400">-</span>
              }
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
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
              <h2 className="text-2xl font-bold text-slate-800">Contratos</h2>
              <p className="text-slate-600">Gerenciar contratos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Contrato
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
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
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
                Todos ({filteredContratos.length})
              </TabsTrigger>
              <TabsTrigger value="ativos">
                Ativos ({contratosAtivos.length})
              </TabsTrigger>
              <TabsTrigger value="cancelados">
                Cancelados ({contratosCancelados.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Carregando...</p>
                  </div>
                ) : (
                  <ContratosTable data={filteredContratos} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="ativos">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <ContratosTable data={contratosAtivos} />
              </div>
            </TabsContent>

            <TabsContent value="cancelados">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <ContratosTable data={contratosCancelados} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
