import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bell, User, FileText, Download, Calendar, Filter } from "lucide-react";
import { useState } from "react";

const relatoriosDisponiveis = [
  {
    id: 1,
    titulo: "Títulos em Atraso",
    descricao: "Relatório de títulos vencidos e em atraso",
    icone: FileText,
    cor: "text-red-600"
  },
  {
    id: 2,
    titulo: "Vencimentos do Mês",
    descricao: "Títulos com vencimento no mês atual",
    icone: FileText,
    cor: "text-orange-600"
  },
  {
    id: 3,
    titulo: "Fluxo de Caixa",
    descricao: "Projeção de pagamentos por período",
    icone: FileText,
    cor: "text-blue-600"
  },
  {
    id: 4,
    titulo: "Contratos Ativos",
    descricao: "Lista de contratos em vigência",
    icone: FileText,
    cor: "text-green-600"
  },
  {
    id: 5,
    titulo: "Resumo por Empresa",
    descricao: "Análise financeira por empresa",
    icone: FileText,
    cor: "text-purple-600"
  },
  {
    id: 6,
    titulo: "Resumo por Fornecedor",
    descricao: "Pagamentos agrupados por fornecedor",
    icone: FileText,
    cor: "text-indigo-600"
  }
];

export default function Relatorios() {
  const [empresaFilter, setEmpresaFilter] = useState("todas");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Relatórios</h2>
              <p className="text-slate-600">Gerar relatórios financeiros</p>
            </div>
            <div className="flex items-center space-x-4">
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
          <div className="mb-8 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">Filtros de Relatório</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Empresa
                </label>
                <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar empresa" />
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
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Data Início
                </label>
                <Input 
                  type="date" 
                  value={periodoInicio} 
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Data Fim
                </label>
                <Input 
                  type="date" 
                  value={periodoFim} 
                  onChange={(e) => setPeriodoFim(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button className="w-full">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Grid de Relatórios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatoriosDisponiveis.map((relatorio) => {
              const IconeComponent = relatorio.icone;
              return (
                <Card key={relatorio.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <IconeComponent className={`h-8 w-8 ${relatorio.cor}`} />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          {relatorio.titulo}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {relatorio.descricao}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full" variant="default">
                        <Download className="h-4 w-4 mr-2" />
                        Gerar PDF
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
