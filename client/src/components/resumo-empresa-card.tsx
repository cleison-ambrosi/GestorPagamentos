import { Card, CardContent } from '@/components/ui/card';

interface ResumoEmpresaCardProps {
  empresa: string;
  emAtraso: number;
  venceHoje: number;
  proximoVencimento: number;
}

export default function ResumoEmpresaCard({
  empresa,
  emAtraso,
  venceHoje,
  proximoVencimento,
}: ResumoEmpresaCardProps) {
  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{empresa}</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-red-600">Em Atraso</span>
            <span className="text-lg font-bold text-red-600">
              R$ {emAtraso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-yellow-600">Vence Hoje</span>
            <span className="text-lg font-bold text-yellow-600">
              R$ {venceHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-600">Amanhã - Fim do Mês</span>
            <span className="text-lg font-bold text-blue-600">
              R$ {proximoVencimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}