import { useQuery } from "@tanstack/react-query";
import { fetchEmpresas } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bell, User } from "lucide-react";

export default function Empresas() {
  const { data: empresas, isLoading } = useQuery({
    queryKey: ['/api/empresas'],
    queryFn: fetchEmpresas
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Empresas</h2>
              <p className="text-slate-600">Gerenciamento de empresas</p>
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
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Lista de Empresas</h3>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Carregando...</p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600">Nenhuma empresa encontrada</p>
                  <p className="text-sm text-slate-500 mt-1">Clique em "Nova Empresa" para começar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
