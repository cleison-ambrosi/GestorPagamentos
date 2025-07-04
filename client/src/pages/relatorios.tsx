import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, User } from 'lucide-react';
import Sidebar from '@/components/sidebar';

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        {/* Header Panel */}
        <div className="bg-white border-b border-slate-200 p-6">
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
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Usuário</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
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
      </main>
    </div>
  );
}