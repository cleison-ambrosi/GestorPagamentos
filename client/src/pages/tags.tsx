import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Bell, User, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

// Dados de exemplo das tags
const tagsData = [
  { id: 1, nome: "Pessoal", cor: "#8B5CF6" },
  { id: 2, nome: "Carros", cor: "#22C55E" },
  { id: 3, nome: "Impostos", cor: "#3B82F6" }
];

const colorPalette = [
  "#EF4444", "#F97316", "#F59E0B", "#84CC16", "#10B981", "#06B6D4", "#3B82F6",
  "#6366F1", "#8B5CF6", "#EC4899", "#EF4444", "#6B7280", "#374151"
];

export default function Tags() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#3B82F6");
  const [corPersonalizada, setCorPersonalizada] = useState("");

  const { data: tags, isLoading } = useQuery({
    queryKey: ['/api/tags'],
    queryFn: fetchTags
  });

  // Usando dados de exemplo enquanto não há dados reais
  const displayTags = tags && tags.length > 0 ? tags : tagsData;

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
    // Aqui seria a lógica para salvar no backend
    console.log("Salvando tag:", { nome, cor: corPersonalizada || cor });
    setModalOpen(false);
  };

  const handleCorChange = (novaCor: string) => {
    setCor(novaCor);
    setCorPersonalizada("");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Tags</h2>
              <p className="text-slate-600">Tags para títulos e contratos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tag
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="text-white text-sm" />
                </div>
                <span className="text-sm font-medium text-slate-700">Usuário</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Carregando...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTags.map((tag) => (
                <div key={tag.id} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
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
                        onClick={() => handleEdit(tag)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
        </div>
      </main>
    </div>
  );
}
