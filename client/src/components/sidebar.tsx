import { Link, useLocation } from "wouter";
import { 
  ChartLine, 
  ChartBar, 
  FileText, 
  File, 
  Truck, 
  Table, 
  Building, 
  Tags,
  Coins
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: ChartLine },
  { href: "/relatorios", label: "Relatórios", icon: ChartBar },
  { href: "/titulos", label: "Títulos", icon: FileText },
  { href: "/contratos", label: "Contratos", icon: File },
  { href: "/fornecedores", label: "Fornecedores", icon: Truck },
  { href: "/plano-contas", label: "Plano de Contas", icon: Table },
  { href: "/empresas", label: "Empresas", icon: Building },
  { href: "/tags", label: "Tags", icon: Tags },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="w-64 bg-white shadow-lg border-r border-slate-200 fixed h-full z-10">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Coins className="text-white text-lg" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-800 text-[16px]">Gestor Pagamentos</h1>
          </div>
        </div>
      </div>
      <nav className="mt-6">
        <div className="space-y-1 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
