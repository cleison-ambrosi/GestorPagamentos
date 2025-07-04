import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import DashboardCards from "@/components/dashboard-cards";
import ResumoEmpresaCard from "@/components/resumo-empresa-card";
import TitulosRecentesCard from "@/components/titulos-recentes-card";
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

          {/* Resumo por Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ResumoEmpresaCard
              empresa="BPrint"
              emAtraso={0}
              venceHoje={0}
              proximoVencimento={34444.00}
            />
            <ResumoEmpresaCard
              empresa="Bremen"
              emAtraso={0}
              venceHoje={0}
              proximoVencimento={0}
            />
            <ResumoEmpresaCard
              empresa="CL2G"
              emAtraso={0}
              venceHoje={0}
              proximoVencimento={0}
            />
            <ResumoEmpresaCard
              empresa="Wingraph"
              emAtraso={0}
              venceHoje={0}
              proximoVencimento={0}
            />
          </div>

          {/* Títulos Cadastrados Recentemente */}
          <TitulosRecentesCard 
            titulos={[
              {
                id: 1,
                titulo: 'ssss',
                fornecedor: 'Energia SP',
                empresa: 'BPrint',
                vencimento: '24/07/25',
                valor: 34444.00,
                saldo: 34444.00,
                status: 'Aberto',
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
