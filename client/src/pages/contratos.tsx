import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Copy } from "lucide-react";
import { fetchContratos, fetchEmpresas } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ContratoModal from "@/components/contrato-modal-4col";
import ConfirmDialog from "@/components/confirm-dialog";
import Sidebar from "@/components/sidebar";

export default function Contratos() {
  const { toast } = useToast();
  const { data: contratos = [], isLoading } = useQuery({
    queryKey: ["/api/contratos"],
    queryFn: fetchContratos,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ["/api/empresas"],
    queryFn: fetchEmpresas,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState(() => {
    // Recupera a última empresa selecionada do localStorage
    return localStorage.getItem('contratos-empresa-filter') || "all";
  });

  // Salva a empresa selecionada no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('contratos-empresa-filter', empresaFilter);
  }, [empresaFilter]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContrato, setEditingContrato] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const createContratoMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/contratos", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({ description: "Contrato criado com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao criar contrato", variant: "destructive" });
    }
  });

  const updateContratoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest(`/api/contratos/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({ description: "Contrato atualizado com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao atualizar contrato", variant: "destructive" });
    }
  });

  const deleteContratoMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/contratos/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contratos"] });
      toast({ description: "Contrato excluído com sucesso!" });
    },
    onError: () => {
      toast({ description: "Erro ao excluir contrato", variant: "destructive" });
    }
  });



  const handleSave = (data: any) => {
    if (editingContrato && editingContrato.id) {
      updateContratoMutation.mutate({ id: editingContrato.id, data });
    } else {
      createContratoMutation.mutate(data);
    }
    setEditingContrato(null);
    setModalOpen(false);
  };

  const handleEdit = (contrato: any) => {
    setEditingContrato(contrato);
    setModalOpen(true);
  };

  const handleDelete = (contrato: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar exclusão",
      description: `Tem certeza que deseja excluir o contrato "${contrato.numero}"?`,
      onConfirm: () => {
        deleteContratoMutation.mutate(contrato.id);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  const handleCopy = (contrato: any) => {
    const copy = { ...contrato, numero: `${contrato.numero} - Cópia` };
    delete copy.id;
    createContratoMutation.mutate(copy);
  };

  const filteredContratos = contratos.filter((contrato: any) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || (
      contrato.numero?.toLowerCase().includes(term) ||
      contrato.descricao?.toLowerCase().includes(term) ||
      contrato.valor?.toString().includes(term) ||
      contrato.fornecedor?.toLowerCase().includes(term) ||
      contrato.observacoes?.toLowerCase().includes(term)
    );
    
    const matchesEmpresa = empresaFilter === "all" || contrato.idEmpresa?.toString() === empresaFilter;
    
    return matchesSearch && matchesEmpresa;
  });

  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span> : 
        part
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-56">
        {/* Header Panel */}
        <div className="bg-white border-b border-slate-200 p-6 pl-[32px] pr-[32px] pt-[16px] pb-[16px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Contratos</h1>
              <p className="text-slate-600">Gerenciar contratos</p>
            </div>
            <Button 
              onClick={() => { 
                // Auto-popular empresa se há filtro ativo
                const novoContrato = empresaFilter !== "all" ? { idEmpresa: parseInt(empresaFilter) } : null;
                setEditingContrato(novoContrato); 
                setModalOpen(true); 
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Contrato
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Filtros */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Empresa
                </label>
                <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id.toString()}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-3/4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pesquisar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar por número, descrição ou fornecedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">ID</TableHead>
                <TableHead className="font-medium text-slate-700">Número</TableHead>
                <TableHead className="font-medium text-slate-700">Descrição</TableHead>
                <TableHead className="font-medium text-slate-700">Nº Parcelas</TableHead>
                <TableHead className="font-medium text-slate-700">Valor Parcela</TableHead>
                <TableHead className="font-medium text-slate-700">Valor Contrato</TableHead>
                <TableHead className="font-medium text-slate-700">Status</TableHead>
                <TableHead className="font-medium text-slate-700 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.map((contrato: any) => (
                <TableRow key={contrato.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleEdit(contrato)}>
                  <TableCell className="font-medium">{contrato.id.toString().padStart(5, '0')}</TableCell>
                  <TableCell className="font-medium">{highlightText(contrato.numeroTitulo || '-', searchTerm)}</TableCell>
                  <TableCell>
                    <div>
                      <div>{contrato.descricao ? highlightText(contrato.descricao, searchTerm) : '-'}</div>
                      <div className="text-sm text-slate-500">
                        {contrato.fornecedor ? highlightText(contrato.fornecedor, searchTerm) : '-'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contrato.numParcela || '-'}</TableCell>
                  <TableCell>{formatCurrency(contrato.valorParcela || 0)}</TableCell>
                  <TableCell>{formatCurrency(contrato.valorContrato || 0)}</TableCell>
                  <TableCell>
                    <Badge variant={contrato.status ? "default" : "secondary"} 
                           className={contrato.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {contrato.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(contrato);
                        }}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(contrato);
                        }}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Copy className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contrato);
                        }}
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <Trash2 className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>

        <ContratoModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          contrato={editingContrato}
          onSave={handleSave}
        />

        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
        />
      </main>
    </div>
  );
}