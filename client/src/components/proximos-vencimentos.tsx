import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

interface ProximosVencimentosProps {
  vencimentos: Array<{
    id: number;
    numeroTitulo: string;
    fornecedor: string;
    vencimento: string;
    valor: number;
  }>;
}

export default function ProximosVencimentos({ vencimentos }: ProximosVencimentosProps) {
  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Próximos Vencimentos</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          Ver todos
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {vencimentos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-slate-400 text-xl" />
            </div>
            <p className="text-slate-600 font-medium">Nenhum vencimento próximo</p>
            <p className="text-sm text-slate-500 mt-1">Não há títulos próximos ao vencimento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vencimentos.map((vencimento) => (
              <div key={vencimento.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div>
                  <h4 className="font-medium text-slate-800">{vencimento.numeroTitulo}</h4>
                  <p className="text-sm text-slate-500">{vencimento.fornecedor}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{formatCurrency(vencimento.valor)}</p>
                  <p className="text-sm text-slate-500">{formatDate(vencimento.vencimento)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
