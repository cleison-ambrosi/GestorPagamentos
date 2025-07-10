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
                
                {dashboardData?.proximosVencimentos && dashboardData.proximosVencimentos.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.proximosVencimentos.map((vencimento) => (
                      <div key={vencimento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{vencimento.numeroTitulo}</p>
                          <p className="text-sm text-gray-600">{vencimento.fornecedor}</p>
                          <p className="text-xs text-gray-500">{new Date(vencimento.vencimento).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(vencimento.valor)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm">Nenhum vencimento próximo</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resumo por Empresa */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumo por Empresa</h3>
                
                {dashboardData?.resumoEmpresas && dashboardData.resumoEmpresas.length > 0 ? (
                  <div className="space-y-6">
                    {dashboardData.resumoEmpresas.map((empresa) => (
                      <div key={empresa.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">{empresa.nome}</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-red-600 mb-1">Em Atraso</p>
                            <p className="text-lg font-bold text-red-600">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(empresa.emAtraso)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-orange-600 mb-1">Vence Hoje</p>
                            <p className="text-lg font-bold text-orange-600">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(empresa.venceHoje)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-blue-600 mb-1">Próximo Vencimento</p>
                            <p className="text-lg font-bold text-blue-600">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(empresa.proximoVencimento)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Nenhuma empresa cadastrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Títulos Cadastrados Recentemente */}
          {dashboardData?.proximosVencimentos && dashboardData.proximosVencimentos.length > 0 && (
            <TitulosRecentesCard 
              titulos={dashboardData.proximosVencimentos.slice(0, 5).map(titulo => ({
                id: titulo.id,
                titulo: titulo.numeroTitulo,
                fornecedor: titulo.fornecedor,
                empresa: '',
                vencimento: new Date(titulo.vencimento).toLocaleDateString('pt-BR'),
                valor: titulo.valor,
                saldo: titulo.valor,
                status: 'Aberto',
              }))}
            />
          )}
        </div>
      </main>
    </div>
  );
}
