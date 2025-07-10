import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  FileBarChart, 
  FileText, 
  File, 
  Truck, 
  Calculator, 
  Building2, 
  Tag,
  DollarSign,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/relatorios", label: "Relatórios", icon: FileBarChart },
  { href: "/titulos", label: "Títulos", icon: FileText },
  { href: "/contratos", label: "Contratos", icon: File },
  { href: "/fornecedores", label: "Fornecedores", icon: Truck },
  { href: "/plano-contas", label: "Plano de Contas", icon: Calculator },
  { href: "/empresas", label: "Empresas", icon: Building2 },
  { href: "/tags", label: "Tags", icon: Tag },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="w-56 bg-white shadow-sm border-r border-slate-200 fixed h-full z-10 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <DollarSign className="text-white w-4 h-4" />
          </div>
          <div>
            <h1 className="font-medium text-slate-900 text-sm">Contas a Pagar</h1>
            <p className="text-xs text-slate-500">Sistema Financeiro</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-4 flex-1">
        <div className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-blue-500 text-white" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* MySQL Config Button - Discreto no canto inferior */}
      <div className="absolute bottom-4 left-4">
        <Link
          href="/mysql-config"
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-md transition-colors opacity-30 hover:opacity-60",
            location === "/mysql-config" 
              ? "bg-blue-500 text-white opacity-100" 
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          )}
          title="Configuração MySQL"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}