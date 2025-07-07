import { 
  Empresa, 
  InsertEmpresa, 
  Fornecedor, 
  InsertFornecedor, 
  PlanoContas, 
  InsertPlanoContas, 
  Tag, 
  InsertTag, 
  Contrato, 
  InsertContrato, 
  Titulo, 
  InsertTitulo, 
  TituloBaixa, 
  InsertTituloBaixa, 
  Configuracao, 
  InsertConfiguracao 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Empresas
  getAllEmpresas(): Promise<Empresa[]>;
  getEmpresa(id: number): Promise<Empresa | undefined>;
  createEmpresa(data: InsertEmpresa): Promise<Empresa>;
  updateEmpresa(id: number, data: Partial<InsertEmpresa>): Promise<Empresa>;
  deleteEmpresa(id: number): Promise<void>;

  // Fornecedores
  getAllFornecedores(): Promise<Fornecedor[]>;
  getFornecedor(id: number): Promise<Fornecedor | undefined>;
  createFornecedor(data: InsertFornecedor): Promise<Fornecedor>;
  updateFornecedor(id: number, data: Partial<InsertFornecedor>): Promise<Fornecedor>;
  deleteFornecedor(id: number): Promise<void>;

  // Plano de Contas
  getAllPlanoContas(): Promise<PlanoContas[]>;
  getPlanoContas(id: number): Promise<PlanoContas | undefined>;
  createPlanoContas(data: InsertPlanoContas): Promise<PlanoContas>;
  updatePlanoContas(id: number, data: Partial<InsertPlanoContas>): Promise<PlanoContas>;
  deletePlanoContas(id: number): Promise<void>;

  // Tags
  getAllTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  createTag(data: InsertTag): Promise<Tag>;
  updateTag(id: number, data: Partial<InsertTag>): Promise<Tag>;
  deleteTag(id: number): Promise<void>;

  // Contratos
  getAllContratos(): Promise<Contrato[]>;
  getContrato(id: number): Promise<Contrato | undefined>;
  createContrato(data: InsertContrato): Promise<Contrato>;
  updateContrato(id: number, data: Partial<InsertContrato>): Promise<Contrato>;
  deleteContrato(id: number): Promise<void>;

  // Títulos
  getAllTitulos(): Promise<Titulo[]>;
  getTitulo(id: number): Promise<Titulo | undefined>;
  createTitulo(data: InsertTitulo): Promise<Titulo>;
  updateTitulo(id: number, data: Partial<InsertTitulo>): Promise<Titulo>;
  deleteTitulo(id: number): Promise<void>;

  // Títulos Baixa
  getAllTitulosBaixa(): Promise<TituloBaixa[]>;
  getTituloBaixa(id: number): Promise<TituloBaixa | undefined>;
  createTituloBaixa(data: InsertTituloBaixa): Promise<TituloBaixa>;
  updateTituloBaixa(id: number, data: Partial<InsertTituloBaixa>): Promise<TituloBaixa>;
  deleteTituloBaixa(id: number): Promise<void>;

  // Configurações
  getConfiguracao(): Promise<Configuracao | undefined>;
  createConfiguracao(data: InsertConfiguracao): Promise<Configuracao>;
  updateConfiguracao(id: number, data: Partial<InsertConfiguracao>): Promise<Configuracao>;
  updateEmpresaContratos(idEmpresa: number): Promise<void>;
  updateEmpresaTitulos(idEmpresa: number): Promise<void>;

  // Dashboard specific queries
  getDashboardData(): Promise<{
    titulosHoje: number;
    valorAtraso: number;
    vencimentosHoje: number;
    vencimentosAmanha: number;
    proximosVencimentos: Array<{
      id: number;
      numeroTitulo: string;
      fornecedor: string;
      vencimento: string;
      valor: number;
    }>;
    resumoEmpresas: Array<{
      id: number;
      nome: string;
      emAtraso: number;
      venceHoje: number;
      proximoVencimento: number;
    }>;
  }>;
}

// Using MySQL implementation instead of PostgreSQL
import { storage } from './storage-mysql';
export { storage };