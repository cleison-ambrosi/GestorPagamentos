import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TitulosRecentesCardProps {
  titulos: Array<{
    id: number;
    titulo: string;
    fornecedor: string;
    empresa: string;
    vencimento: string;
    valor: number;
    saldo: number;
    status: string;
  }>;
}

export default function TitulosRecentesCard({ titulos }: TitulosRecentesCardProps) {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Títulos Cadastrados Recentemente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="text-left pb-2">TÍTULO</th>
                <th className="text-left pb-2">FORNECEDOR / EMPRESA</th>
                <th className="text-left pb-2">VENCIMENTO</th>
                <th className="text-left pb-2">VALOR</th>
                <th className="text-left pb-2">SALDO</th>
                <th className="text-left pb-2">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {titulos.map((titulo) => (
                <tr key={titulo.id} className="text-sm">
                  <td className="py-2">
                    <div>
                      <div className="font-medium">{titulo.titulo}</div>
                      <div className="text-gray-500 text-xs">{titulo.titulo}</div>
                    </div>
                  </td>
                  <td className="py-2">
                    <div>
                      <div className="font-medium">{titulo.fornecedor}</div>
                      <div className="text-gray-500 text-xs">{titulo.empresa}</div>
                    </div>
                  </td>
                  <td className="py-2">{titulo.vencimento}</td>
                  <td className="py-2">
                    R$ {titulo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 text-blue-600 font-medium">
                    R$ {titulo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {titulo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}