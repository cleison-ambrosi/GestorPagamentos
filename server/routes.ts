import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmpresaSchema, insertFornecedorSchema, insertPlanoContasSchema, insertTagSchema, insertContratoSchema, insertTituloSchema, insertTituloBaixaSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard
  app.get("/api/dashboard", async (req, res) => {
    try {
      const data = await storage.getDashboardData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
    }
  });

  // Empresas
  app.get("/api/empresas", async (req, res) => {
    try {
      const empresas = await storage.getAllEmpresas();
      res.json(empresas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar empresas" });
    }
  });

  app.get("/api/empresas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const empresa = await storage.getEmpresa(id);
      if (!empresa) {
        return res.status(404).json({ error: "Empresa não encontrada" });
      }
      res.json(empresa);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar empresa" });
    }
  });

  app.post("/api/empresas", async (req, res) => {
    try {
      const data = insertEmpresaSchema.parse(req.body);
      const empresa = await storage.createEmpresa(data);
      res.status(201).json(empresa);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/empresas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertEmpresaSchema.partial().parse(req.body);
      const empresa = await storage.updateEmpresa(id, data);
      res.json(empresa);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/empresas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEmpresa(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar empresa" });
    }
  });

  // Fornecedores
  app.get("/api/fornecedores", async (req, res) => {
    try {
      const fornecedores = await storage.getAllFornecedores();
      res.json(fornecedores);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar fornecedores" });
    }
  });

  app.get("/api/fornecedores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const fornecedor = await storage.getFornecedor(id);
      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }
      res.json(fornecedor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar fornecedor" });
    }
  });

  app.post("/api/fornecedores", async (req, res) => {
    try {
      const data = insertFornecedorSchema.parse(req.body);
      const fornecedor = await storage.createFornecedor(data);
      res.status(201).json(fornecedor);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/fornecedores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertFornecedorSchema.partial().parse(req.body);
      const fornecedor = await storage.updateFornecedor(id, data);
      res.json(fornecedor);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/fornecedores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFornecedor(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar fornecedor" });
    }
  });

  // Plano de Contas
  app.get("/api/plano-contas", async (req, res) => {
    try {
      const planoContas = await storage.getAllPlanoContas();
      res.json(planoContas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar plano de contas" });
    }
  });

  app.post("/api/plano-contas", async (req, res) => {
    try {
      const data = insertPlanoContasSchema.parse(req.body);
      const planoContas = await storage.createPlanoContas(data);
      res.status(201).json(planoContas);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/plano-contas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertPlanoContasSchema.partial().parse(req.body);
      const planoContas = await storage.updatePlanoContas(id, data);
      res.json(planoContas);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/plano-contas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertPlanoContasSchema.partial().parse(req.body);
      const planoContas = await storage.updatePlanoContas(id, data);
      res.json(planoContas);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/plano-contas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePlanoContas(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar plano de contas" });
    }
  });

  // Tags
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar tags" });
    }
  });

  app.post("/api/tags", async (req, res) => {
    try {
      const data = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(data);
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTagSchema.partial().parse(req.body);
      const tag = await storage.updateTag(id, data);
      res.json(tag);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTag(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar tag" });
    }
  });

  // Contratos
  app.get("/api/contratos", async (req, res) => {
    try {
      const contratos = await storage.getAllContratos();
      res.json(contratos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar contratos" });
    }
  });

  app.post("/api/contratos", async (req, res) => {
    try {
      const data = insertContratoSchema.parse(req.body);
      const contrato = await storage.createContrato(data);
      res.status(201).json(contrato);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/contratos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertContratoSchema.partial().parse(req.body);
      const contrato = await storage.updateContrato(id, data);
      res.json(contrato);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/contratos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContrato(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar contrato" });
    }
  });

  // Títulos
  app.get("/api/titulos", async (req, res) => {
    try {
      const titulos = await storage.getAllTitulos();
      res.json(titulos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar títulos" });
    }
  });

  app.post("/api/titulos", async (req, res) => {
    try {
      const data = insertTituloSchema.parse(req.body);
      const titulo = await storage.createTitulo(data);
      res.status(201).json(titulo);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/titulos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTituloSchema.partial().parse(req.body);
      const titulo = await storage.updateTitulo(id, data);
      res.json(titulo);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/titulos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTitulo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar título" });
    }
  });

  // Títulos Baixa
  app.get("/api/titulos-baixa", async (req, res) => {
    try {
      const titulosBaixa = await storage.getAllTitulosBaixa();
      res.json(titulosBaixa);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar baixas de títulos" });
    }
  });

  app.post("/api/titulos-baixa", async (req, res) => {
    try {
      const data = insertTituloBaixaSchema.parse(req.body);
      const tituloBaixa = await storage.createTituloBaixa(data);
      res.status(201).json(tituloBaixa);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  // Configurações
  app.get("/api/configuracao", async (req, res) => {
    try {
      const configuracao = await storage.getConfiguracao();
      res.json(configuracao);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar configuração" });
    }
  });

  app.post("/api/configuracao/empresa-contratos", async (req, res) => {
    try {
      const { idEmpresa } = req.body;
      if (!idEmpresa) {
        return res.status(400).json({ error: "idEmpresa é obrigatório" });
      }
      await storage.updateEmpresaContratos(idEmpresa);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar empresa dos contratos" });
    }
  });

  app.post("/api/configuracao/empresa-titulos", async (req, res) => {
    try {
      const { idEmpresa } = req.body;
      if (!idEmpresa) {
        return res.status(400).json({ error: "idEmpresa é obrigatório" });
      }
      await storage.updateEmpresaTitulos(idEmpresa);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar empresa dos títulos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
