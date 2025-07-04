import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Titulos from "@/pages/titulos";
import Contratos from "@/pages/contratos";
import Fornecedores from "@/pages/fornecedores";
import Empresas from "@/pages/empresas";
import PlanoContas from "@/pages/plano-contas";
import Tags from "@/pages/tags";
import Relatorios from "@/pages/relatorios";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/titulos" component={Titulos} />
      <Route path="/contratos" component={Contratos} />
      <Route path="/fornecedores" component={Fornecedores} />
      <Route path="/empresas" component={Empresas} />
      <Route path="/plano-contas" component={PlanoContas} />
      <Route path="/tags" component={Tags} />
      <Route path="/relatorios" component={Relatorios} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
