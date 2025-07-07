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
        <main className="flex-1 ml-56">
          <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
              <p className="text-slate-600">Visão geral do sistema</p>
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
      <main className="flex-1 ml-56">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-600">Visão geral do sistema</p>
          </div>
        </header>

        <div className="p-8">
          <DashboardCards data={dashboardData || {
            titulosHoje: 0,
            valorAtraso: 0,
            vencimentosHoje: 0,
            vencimentosAmanha: 0
          }} />

          {/* Layout principal com dois cards lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Próximos Vencimentos */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Próximos Vencimentos</h3>
                  <button className="text-blue-600 text-sm hover:underline">Ver todos</button>
                </div>
                
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm">Nenhum vencimento próximo</p>
                </div>
              </CardContent>
            </Card>

            {/* Resumo por Empresa */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumo por Empresa</h3>
                
                <div className="space-y-6">
                  {/* BPrint */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">BPrint</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-red-600 mb-1">Em Atraso</p>
                        <p className="text-lg font-bold text-red-600">R$ 0,00</p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-600 mb-1">Vence Hoje</p>
                        <p className="text-lg font-bold text-yellow-600">R$ 0,00</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 mb-1">Amanhã - Fim do Mês</p>
                        <p className="text-lg font-bold text-blue-600">R$ 34.444,00</p>
                      </div>
                    </div>
                  </div>

                  {/* Bremen */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Bremen</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-red-600 mb-1">Em Atraso</p>
                        <p className="text-lg font-bold text-red-600">R$ 0,00</p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-600 mb-1">Vence Hoje</p>
                        <p className="text-lg font-bold text-yellow-600">R$ 0,00</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 mb-1">Amanhã - Fim do Mês</p>
                        <p className="text-lg font-bold text-blue-600">R$ 0,00</p>
                      </div>
                    </div>
                  </div>

                  {/* CL2G */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">CL2G</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-red-600 mb-1">Em Atraso</p>
                        <p className="text-lg font-bold text-red-600">R$ 0,00</p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-600 mb-1">Vence Hoje</p>
                        <p className="text-lg font-bold text-yellow-600">R$ 0,00</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 mb-1">Amanhã - Fim do Mês</p>
                        <p className="text-lg font-bold text-blue-600">R$ 0,00</p>
                      </div>
                    </div>
                  </div>

                  {/* Wingraph */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Wingraph</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-red-600 mb-1">Em Atraso</p>
                        <p className="text-lg font-bold text-red-600">R$ 0,00</p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-600 mb-1">Vence Hoje</p>
                        <p className="text-lg font-bold text-yellow-600">R$ 0,00</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 mb-1">Amanhã - Fim do Mês</p>
                        <p className="text-lg font-bold text-blue-600">R$ 0,00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
