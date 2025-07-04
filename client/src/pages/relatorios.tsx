import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Filter, User } from 'lucide-react';

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('Em Aberto');
  const [pesquisa, setPesquisa] = useState('');

  const mockTitulos = [
    {
      id: 1,
      titulo: 'ssss',
      empresa: 'BPrint',
      fornecedor: 'Energia SP',
      valorTotal: 34444.00,
      saldo: 34444.00,
      descricao: 'teste'
    }
  ];

  const totalGeral = mockTitulos.reduce((sum, item) => sum + item.valorTotal, 0);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-gray-600">Relatórios e análises financeiras</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Usuário" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Usuário</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodo">Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em Aberto">Em Aberto</SelectItem>
                  <SelectItem value="Pagos">Pagos</SelectItem>
                  <SelectItem value="Vencidos">Vencidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pesquisa">Pesquisar</Label>
              <Input
                id="pesquisa"
                placeholder="Pesquisar por fornecedor, número do título ou valor..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Período */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-700">Vencimento: 23/07/2025</h3>
          <div className="text-right">
            <p className="text-sm text-slate-600">Total do Dia</p>
            <p className="text-2xl font-bold text-slate-900">R$ 34.444,00</p>
          </div>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-700">TÍTULO</th>
                  <th className="text-left p-4 font-medium text-slate-700">EMPRESA</th>
                  <th className="text-left p-4 font-medium text-slate-700">FORNECEDOR</th>
                  <th className="text-left p-4 font-medium text-slate-700">VALOR TOTAL</th>
                  <th className="text-left p-4 font-medium text-slate-700">SALDO</th>
                  <th className="text-left p-4 font-medium text-slate-700">DESCRIÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {mockTitulos.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4">{item.titulo}</td>
                    <td className="p-4">{item.empresa}</td>
                    <td className="p-4">{item.fornecedor}</td>
                    <td className="p-4">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-blue-600 font-medium">
                      R$ {item.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">{item.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Total Geral */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-600">Total Geral</h3>
            <p className="text-sm text-slate-600">1 título(s)</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">
              R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}