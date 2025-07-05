import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react";
import Sidebar from "@/components/sidebar";

export default function MySQLConfig() {
  const [config, setConfig] = useState({
    host: "95.111.213.45",
    port: "18411",
    user: "avnadmin",
    password: "AVNS_mv1K1_d_Hr_ZbRKQWMs",
    database: "pagamentos"
  });

  const { data: status, refetch, isLoading } = useQuery({
    queryKey: ["/api/mysql-status"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Type-safe access to status properties
  const connectionStatus = status as {
    connected?: boolean;
    error?: string;
    config?: {
      host?: string;
      port?: number;
      database?: string;
    };
    timestamp?: string;
  } | undefined;

  const handleTest = () => {
    refetch();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Configuração MySQL</h1>
              <p className="text-slate-600">Diagnosticar e configurar conexão com MySQL</p>
            </div>
            <Button onClick={handleTest} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Testar Conexão
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Status da Conexão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Status da Conexão MySQL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {connectionStatus?.connected ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Conectado
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Desconectado
                      </Badge>
                    </>
                  )}
                </div>

                {connectionStatus?.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium">Erro:</p>
                    <p className="text-sm text-red-700">{connectionStatus.error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Host</p>
                    <p className="font-mono text-sm">{connectionStatus?.config?.host || config.host}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Porta</p>
                    <p className="font-mono text-sm">{connectionStatus?.config?.port || config.port}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Database</p>
                    <p className="font-mono text-sm">{connectionStatus?.config?.database || config.database}</p>
                  </div>
                </div>

                {connectionStatus?.timestamp && (
                  <p className="text-xs text-slate-500">
                    Última verificação: {new Date(connectionStatus.timestamp).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Diagnóstico */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connectionStatus?.error?.includes('ENOTFOUND') && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Problema de DNS Detectado</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p>• O hostname não pode ser resolvido pelo DNS</p>
                      <p>• Verifique se o servidor MySQL está acessível publicamente</p>
                      <p>• Considere usar um IP direto ao invés do hostname</p>
                      <p>• Confirme que a porta 18411 está aberta no firewall</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Soluções Recomendadas</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>1. Configure variáveis de ambiente com IP direto do servidor</p>
                    <p>2. Verifique se o servidor MySQL aceita conexões externas</p>
                    <p>3. Confirme que as credenciais estão corretas</p>
                    <p>4. Teste a conectividade de rede com o servidor</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuração Atual */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Host MySQL
                    </label>
                    <Input
                      value={config.host}
                      onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                      placeholder="hostname ou IP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Porta
                    </label>
                    <Input
                      value={config.port}
                      onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
                      placeholder="18411"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Usuário
                    </label>
                    <Input
                      value={config.user}
                      onChange={(e) => setConfig(prev => ({ ...prev, user: e.target.value }))}
                      placeholder="usuário"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Database
                    </label>
                    <Input
                      value={config.database}
                      onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
                      placeholder="nome do banco"
                    />
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">
                    Para aplicar uma nova configuração, defina as variáveis de ambiente:
                  </p>
                  <code className="text-xs bg-slate-800 text-slate-100 p-2 rounded block">
                    export MYSQL_HOST="{config.host}"<br/>
                    export MYSQL_PORT="{config.port}"<br/>
                    export MYSQL_USER="{config.user}"<br/>
                    export MYSQL_DATABASE="{config.database}"
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}