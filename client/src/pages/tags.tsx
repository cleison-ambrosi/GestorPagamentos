import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTags } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, User, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";



const colorPalette = [
  "#EF4444", "#F97316", "#F59E0B", "#84CC16", "#10B981", "#06B6D4", "#3B82F6",
  "#6366F1", "#8B5CF6", "#EC4899", "#6B7280", "#374151", "#F43F5E"
];

export default function Tags() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [nome, setNome] = useState("");
  const { toast } = useToast();
  const [cor, setCor] = useState("#3B82F6");
  const [corPersonalizada, setCorPersonalizada] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {}
  });

  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery({
    queryKey: ['/api/tags'],
    queryFn: fetchTags
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/tags', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      setModalOpen(false);
      toast({
        title: "Sucesso!",
        description: "Tag criada com sucesso.",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/tags/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      setModalOpen(false);
      toast({
        title: "Sucesso!",
        description: "Tag atualizada com sucesso.",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/tags/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      toast({
        title: "Sucesso!",
        description: "Tag excluída com sucesso.",
      });
    }
  });

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setNome(tag.nome);
    setCor(tag.cor);
    setCorPersonalizada("");
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingTag(null);
    setNome("");
    setCor("#3B82F6");
    setCorPersonalizada("");
    setModalOpen(true);
  };

  const handleSave = () => {
    const tagData = { nome, cor: corPersonalizada || cor };
    
    console.log("Salvando tag:", tagData);
    
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data: tagData });
    } else {
      createMutation.mutate(tagData);
    }
  };

  const handleDelete = (tag: any) => {
    setConfirmDialog({
      open: true,
      title: "Confirmar Exclusão",
      description: `Tem certeza que deseja excluir a tag "${tag.nome}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        console.log("Excluindo tag:", tag.id);
        deleteMutation.mutate(tag.id);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleCorChange = (novaCor: string) => {
    setCor(novaCor);
    setCorPersonalizada("");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-56">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Tags</h2>
              <p className="text-slate-600">Tags para títulos e contratos</p>
            </div>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tag
            </Button>
          </div>
        </header>

        <div className="p-8">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Carregando...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tags?.map((tag) => (
                <div key={tag.id} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm cursor-pointer hover:bg-slate-50" onClick={() => handleEdit(tag)}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: tag.cor }}
                      ></div>
                      <h3 className="text-lg font-semibold text-slate-800">{tag.nome}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(tag);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tag);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge 
                      variant="secondary" 
                      style={{ 
                        backgroundColor: tag.cor + '20',
                        color: tag.cor,
                        borderColor: tag.cor + '40'
                      }}
                    >
                      {tag.cor}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal de Edição de Tag */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Tag</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Altere os dados da tag conforme necessário
                </p>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome da Tag *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome da tag"
                  />
                </div>

                <div>
                  <Label>Cor *</Label>
                  <div className="grid grid-cols-7 gap-2 mt-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          cor === color ? "border-gray-400 scale-110" : "border-gray-200"
                        } transition-all`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleCorChange(color)}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <Input
                      value={corPersonalizada || cor}
                      onChange={(e) => setCorPersonalizada(e.target.value)}
                      placeholder="#3B82F6"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Clique em uma cor ou digite o código hexadecimal
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={!nome.trim()}
                  className="w-full"
                >
                  Salvar Tag
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Diálogo de Confirmação */}
          <ConfirmDialog
            open={confirmDialog.open}
            onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
            title={confirmDialog.title}
            description={confirmDialog.description}
            onConfirm={confirmDialog.onConfirm}
          />
        </div>
      </main>
    </div>
  );
}
