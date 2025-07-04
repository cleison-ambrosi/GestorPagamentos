import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, DollarSign, Calendar, CalendarPlus } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface DashboardCardsProps {
  data: {
    titulosHoje: number;
    valorAtraso: number;
    vencimentosHoje: number;
    vencimentosAmanha: number;
  };
}

export default function DashboardCards({ data }: DashboardCardsProps) {
  const cards = [
    {
      title: "Títulos Hoje",
      value: data.titulosHoje.toString(),
      subtitle: "Títulos vencendo hoje",
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-danger"
    },
    {
      title: "Valor em Atraso",
      value: formatCurrency(data.valorAtraso),
      subtitle: "Total em atraso",
      icon: DollarSign,
      iconBg: "bg-yellow-100",
      iconColor: "text-warning"
    },
    {
      title: "Vencimentos Hoje",
      value: formatCurrency(data.vencimentosHoje),
      subtitle: "Total vencendo hoje",
      icon: Calendar,
      iconBg: "bg-yellow-100",
      iconColor: "text-warning"
    },
    {
      title: "Vencimentos Amanhã",
      value: formatCurrency(data.vencimentosAmanha),
      subtitle: "Total vencendo amanhã",
      icon: CalendarPlus,
      iconBg: "bg-blue-100",
      iconColor: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">{card.title}</h3>
              <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{card.value}</div>
            <p className="text-sm text-slate-500 mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
