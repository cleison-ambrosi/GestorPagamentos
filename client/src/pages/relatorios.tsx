import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Filter, Search, Package } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import { useQuery } from '@tanstack/react-query';

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('vencemHoje');
  const [pesquisa, setPesquisa] = useState('');

  // Buscar dados reais da API
  const { data: titulos = [] } = useQuery({
    queryKey: ["/api/titulos"],
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ["/api/empresas"],
  });

  const { data: fornecedores = [] } = useQuery({
    queryKey: ["/api/fornecedores"],
  });

  // Função para filtrar títulos baseado no período selecionado
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
  const titulosFiltrados = filtrarTitulosPorPeriodo(titulos, periodo).filter((titulo: any) => {
    if (!pesquisa.trim()) return true;
    const termoPesquisa = pesquisa.toLowerCase();
    
    // Buscar nomes da empresa e fornecedor
    const empresa = empresas.find((e: any) => e.id === titulo.idEmpresa);
    const fornecedor = fornecedores.find((f: any) => f.id === titulo.idFornecedor);
    
    return (
      titulo.numeroTitulo?.toLowerCase().includes(termoPesquisa) ||
      titulo.descricao?.toLowerCase().includes(termoPesquisa) ||
      titulo.observacoes?.toLowerCase().includes(termoPesquisa) ||
      empresa?.nome?.toLowerCase().includes(termoPesquisa) ||
      empresa?.apelido?.toLowerCase().includes(termoPesquisa) ||
      fornecedor?.nome?.toLowerCase().includes(termoPesquisa) ||
      titulo.valorTotal?.toString().includes(termoPesquisa)
    );
  });

  const totalGeral = titulosFiltrados.reduce((sum: number, item: any) => sum + parseFloat(item.valorTotal || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-48">
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
                  <SelectTrigger className="w-full">
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
                    placeholder="Pesquisar por fornecedor, número do título ou valor..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Resultados */}
          {titulosFiltrados.length > 0 ? (
            <>
              <Card className="bg-white border border-slate-200 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-medium text-slate-700">TÍTULO</TableHead>
                          <TableHead className="font-medium text-slate-700">EMPRESA</TableHead>
                          <TableHead className="font-medium text-slate-700">FORNECEDOR</TableHead>
                          <TableHead className="font-medium text-slate-700">VENCIMENTO</TableHead>
                          <TableHead className="font-medium text-slate-700">VALOR TOTAL</TableHead>
                          <TableHead className="font-medium text-slate-700">SALDO</TableHead>
                          <TableHead className="font-medium text-slate-700">STATUS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {titulosFiltrados.map((titulo: any) => {
                          const empresa = empresas.find((e: any) => e.id === titulo.idEmpresa);
                          const fornecedor = fornecedores.find((f: any) => f.id === titulo.idFornecedor);
                          
                          return (
                            <TableRow key={titulo.id} className="border-b">
                              <TableCell className="font-medium">{titulo.numeroTitulo}</TableCell>
                              <TableCell>{empresa?.nome || empresa?.apelido || '-'}</TableCell>
                              <TableCell>{fornecedor?.nome || '-'}</TableCell>
                              <TableCell>{new Date(titulo.vencimento).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>R$ {parseFloat(titulo.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                              <TableCell className="text-blue-600 font-medium">
                                R$ {parseFloat(titulo.saldoPagar || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  titulo.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                                  titulo.status === 2 ? 'bg-blue-100 text-blue-800' :
                                  titulo.status === 3 ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {titulo.status === 1 ? 'Em Aberto' :
                                   titulo.status === 2 ? 'Parcial' :
                                   titulo.status === 3 ? 'Pago' : 'Cancelado'}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Total Geral */}
              <div className="mt-6 bg-slate-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">Total Geral</h3>
                    <p className="text-sm text-slate-600">{titulosFiltrados.length} título(s) encontrado(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center">
                  <Package className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-slate-500">Tente ajustar os filtros para encontrar o que procura.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}