import { useState } from 'react';
import { Download, Filter, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '@/components/sidebar';
import { useQuery } from '@tanstack/react-query';

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('emAberto');
  const [pesquisa, setPesquisa] = useState('');

  // Buscar dados reais da API
  const { data: titulos = [] } = useQuery({
    queryKey: ['/api/titulos'],
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ['/api/empresas'],
  });

  const { data: fornecedores = [] } = useQuery({
    queryKey: ['/api/fornecedores'],
  });

  const filtrarTitulosPorPeriodo = (titulos: any[], periodo: string) => {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    const proximos7Dias = new Date(hoje);
    proximos7Dias.setDate(hoje.getDate() + 7);

    return titulos.filter((titulo: any) => {
      const vencimento = new Date(titulo.vencimento);
      
      switch (periodo) {
        case 'todosVencidos':
          return vencimento < hoje;
        case 'vencidosOntem':
          const ontem = new Date(hoje);
          ontem.setDate(hoje.getDate() - 1);
          return vencimento.toDateString() === ontem.toDateString();
        case 'vencemHoje':
          return vencimento.toDateString() === hoje.toDateString();
        case 'vencemAmanha':
          return vencimento.toDateString() === amanha.toDateString();
        case 'proximos7Dias':
          return vencimento >= hoje && vencimento <= proximos7Dias;
        case 'ateFinalMes':
          return vencimento >= hoje && vencimento <= fimMes;
        case 'emAberto':
          return titulo.status === 1; // Em Aberto
        case 'pagos':
          return titulo.status === 3; // Pago
        default:
          return true;
      }
    });
  };

  // Filtrar títulos baseado no período e pesquisa
  const titulosPorPeriodo = filtrarTitulosPorPeriodo(titulos, periodo);
  const titulosFiltrados = titulosPorPeriodo.filter((titulo: any) => {
    if (!pesquisa.trim()) return true;
    const termoPesquisa = pesquisa.toLowerCase();
    
    const empresa = empresas.find((e: any) => e.id === titulo.idEmpresa);
    const fornecedor = fornecedores.find((f: any) => f.id === titulo.idFornecedor);
    
    // Buscar qualquer substring nos campos principais
    return (
      titulo.numeroTitulo?.toLowerCase().includes(termoPesquisa) ||
      empresa?.nome?.toLowerCase().includes(termoPesquisa) ||
      empresa?.apelido?.toLowerCase().includes(termoPesquisa) ||
      fornecedor?.nome?.toLowerCase().includes(termoPesquisa) ||
      titulo.valorTotal?.toString().replace('.', ',').includes(termoPesquisa) ||
      titulo.saldoPagar?.toString().replace('.', ',').includes(termoPesquisa)
    );
  });

  // Agrupar títulos por data de vencimento
  const titulosAgrupados = titulosFiltrados.reduce((grupos: any, titulo: any) => {
    const dataVencimento = new Date(titulo.vencimento).toLocaleDateString('pt-BR');
    if (!grupos[dataVencimento]) {
      grupos[dataVencimento] = [];
    }
    grupos[dataVencimento].push(titulo);
    return grupos;
  }, {});

  // Ordenar as datas
  const datasOrdenadas = Object.keys(titulosAgrupados).sort((a, b) => {
    const dataA = new Date(a.split('/').reverse().join('-'));
    const dataB = new Date(b.split('/').reverse().join('-'));
    return dataA.getTime() - dataB.getTime();
  });

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  // Calcular total geral
  const totalGeral = titulosFiltrados.reduce((sum: number, item: any) => sum + parseFloat(item.valorTotal || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-56">
        {/* Header Panel */}
        <div className="bg-white border-b border-slate-200 p-6 pl-[32px] pr-[32px] pt-[16px] pb-[16px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
              <p className="text-slate-600">Relatórios e análises financeiras</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Seção de Filtros */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-800">Filtros</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Label className="text-sm font-medium text-slate-700 mb-2 block">Período</Label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todosVencidos">Todos os Vencidos</SelectItem>
                    <SelectItem value="vencidosOntem">Vencidos Ontem</SelectItem>
                    <SelectItem value="vencemHoje">Vencem Hoje</SelectItem>
                    <SelectItem value="vencemAmanha">Vencem Amanhã</SelectItem>
                    <SelectItem value="proximos7Dias">Próximos 7 dias</SelectItem>
                    <SelectItem value="ateFinalMes">Até final do mês</SelectItem>
                    <SelectItem value="emAberto">Em Aberto</SelectItem>
                    <SelectItem value="pagos">Pagos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-3">
                <Label className="text-sm font-medium text-slate-700 mb-2 block">Pesquisar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar por título, empresa, fornecedor ou valor..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Resultados */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-800">Resultados</h3>
            </div>
            
            <div className="overflow-x-auto">
              {datasOrdenadas.length > 0 ? (
                <div className="space-y-6">
                  {datasOrdenadas.map((dataVencimento) => {
                    const titulosDoDia = titulosAgrupados[dataVencimento];
                    const totalDoDia = titulosDoDia.reduce((sum: number, titulo: any) => 
                      sum + parseFloat(titulo.valorTotal || 0), 0);
                    
                    return (
                      <div key={dataVencimento} className="border border-slate-200 rounded-lg">
                        {/* Cabeçalho da Data */}
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-800">
                              Vencimento: {dataVencimento}
                            </h4>
                            <div className="text-right">
                              <span className="text-sm text-slate-600">
                                {titulosDoDia.length} título{titulosDoDia.length !== 1 ? 's' : ''} - 
                              </span>
                              <span className="ml-2 font-semibold text-slate-800">
                                {formatarMoeda(totalDoDia)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tabela dos Títulos */}
                        <table className="min-w-full table-fixed">
                          <thead>
                            <tr className="bg-white">
                              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título</th>
                              <th className="w-48 px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Empresa</th>
                              <th className="w-48 px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fornecedor</th>
                              <th className="w-32 px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Total</th>
                              <th className="w-32 px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Saldo a Pagar</th>
                              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {titulosDoDia.map((titulo: any) => {
                              const empresa = empresas.find((e: any) => e.id === titulo.idEmpresa);
                              const fornecedor = fornecedores.find((f: any) => f.id === titulo.idFornecedor);
                              
                              return (
                                <tr key={titulo.id} className="hover:bg-slate-50">
                                  <td className="w-32 px-4 py-4 text-sm font-medium text-slate-900 truncate">{titulo.numeroTitulo}</td>
                                  <td className="w-48 px-4 py-4 text-sm text-slate-600 truncate">{empresa?.nome || empresa?.apelido}</td>
                                  <td className="w-48 px-4 py-4 text-sm text-slate-600 truncate">{fornecedor?.nome}</td>
                                  <td className="w-32 px-4 py-4 text-sm font-medium text-slate-900 text-right">{formatarMoeda(parseFloat(titulo.valorTotal))}</td>
                                  <td className="w-32 px-4 py-4 text-sm font-medium text-slate-900 text-right">{formatarMoeda(parseFloat(titulo.saldoPagar || titulo.valorTotal))}</td>
                                  <td className="w-24 px-4 py-4 text-sm">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      titulo.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                                      titulo.status === 2 ? 'bg-blue-100 text-blue-800' :
                                      titulo.status === 3 ? 'bg-green-100 text-green-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {titulo.status === 1 ? 'Em Aberto' :
                                       titulo.status === 2 ? 'Parcial' :
                                       titulo.status === 3 ? 'Pago' :
                                       'Cancelado'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Nenhum título encontrado para os filtros selecionados.
                </div>
              )}
            </div>
            
            {/* Total Geral no Final */}
            {titulosFiltrados.length > 0 && (
              <div className="border-t border-slate-200 pt-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Total de {titulosFiltrados.length} título{titulosFiltrados.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Total Geral</p>
                    <p className="text-xl font-bold text-slate-800">{formatarMoeda(totalGeral)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}