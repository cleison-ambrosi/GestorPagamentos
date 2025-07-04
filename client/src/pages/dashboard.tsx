import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import DashboardCards from "@/components/dashboard-cards";
import ProximosVencimentos from "@/components/proximos-vencimentos";
import ResumoEmpresas from "@/components/resumo-empresas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, User, Plus, File, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: fetchDashboardData
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64">
          <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
                <p className="text-slate-600">Visão geral do sistema</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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
              <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
              <p className="text-slate-600">Visão geral do sistema</p>
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
          <DashboardCards data={dashboardData} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProximosVencimentos vencimentos={dashboardData.proximosVencimentos} />
            <ResumoEmpresas empresas={dashboardData.resumoEmpresas} />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/titulos'}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <Plus className="text-primary h-4 w-4" />
                    </div>
                    Novo Título
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/contratos'}
                  >
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                      <File className="text-success h-4 w-4" />
                    </div>
                    Novo Contrato
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/fornecedores'}
                  >
                    <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
                      <Truck className="text-warning h-4 w-4" />
                    </div>
                    Novo Fornecedor
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Estatísticas Mensais</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Títulos Pagos</span>
                    <span className="font-semibold text-success">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Títulos Pendentes</span>
                    <span className="font-semibold text-warning">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Títulos em Atraso</span>
                    <span className="font-semibold text-danger">0</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Total Processado</span>
                      <span className="font-semibold text-slate-800">R$ 0,00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Alertas do Sistema</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Sistema Atualizado</p>
                      <p className="text-xs text-slate-600">Última atualização: hoje</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Backup Realizado</p>
                      <p className="text-xs text-slate-600">Última execução: ontem</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
