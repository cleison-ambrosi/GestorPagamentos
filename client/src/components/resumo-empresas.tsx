import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getInitials } from "@/lib/format";

interface ResumoEmpresasProps {
  empresas: Array<{
    id: number;
    nome: string;
    emAtraso: number;
    venceHoje: number;
    proximoVencimento: number;
  }>;
}

const empresaColors = [
  "bg-gradient-to-r from-primary to-blue-600",
  "bg-gradient-to-r from-success to-green-600",
  "bg-gradient-to-r from-warning to-yellow-600",
  "bg-gradient-to-r from-purple-500 to-purple-600",
  "bg-gradient-to-r from-pink-500 to-pink-600",
];

export default function ResumoEmpresas({ empresas }: ResumoEmpresasProps) {
  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Resumo por Empresa</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          Ver todos
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {empresas.map((empresa, index) => (
            <div key={empresa.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${empresaColors[index % empresaColors.length]} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">{getInitials(empresa.nome)}</span>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{empresa.nome}</h4>
                  <p className="text-sm text-slate-500">Empresa</p>
                </div>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-danger font-medium">{formatCurrency(empresa.emAtraso)}</p>
                    <p className="text-xs text-slate-500">Em Atraso</p>
                  </div>
                  <div className="text-center">
                    <p className="text-warning font-medium">{formatCurrency(empresa.venceHoje)}</p>
                    <p className="text-xs text-slate-500">Vence Hoje</p>
                  </div>
                  <div className="text-center">
                    <p className="text-primary font-medium">{formatCurrency(empresa.proximoVencimento)}</p>
                    <p className="text-xs text-slate-500">Amanhã - Fim do Mês</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
