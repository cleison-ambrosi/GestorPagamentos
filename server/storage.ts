import { 
  empresa, fornecedor, planoContas, tag, contrato, titulo, tituloBaixa,
  type Empresa, type InsertEmpresa,
  type Fornecedor, type InsertFornecedor,
  type PlanoContas, type InsertPlanoContas,
  type Tag, type InsertTag,
  type Contrato, type InsertContrato,
  type Titulo, type InsertTitulo,
  type TituloBaixa, type InsertTituloBaixa
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // Empresas
  async getAllEmpresas(): Promise<Empresa[]> {
    return await db.select().from(empresa).orderBy(asc(empresa.nome));
  }

  async getEmpresa(id: number): Promise<Empresa | undefined> {
    const [result] = await db.select().from(empresa).where(eq(empresa.id, id));
    return result || undefined;
  }

  async createEmpresa(data: InsertEmpresa): Promise<Empresa> {
    const [result] = await db.insert(empresa).values(data).returning();
    return result;
  }

  async updateEmpresa(id: number, data: Partial<InsertEmpresa>): Promise<Empresa> {
    const [result] = await db.update(empresa).set(data).where(eq(empresa.id, id)).returning();
    return result;
  }

  async deleteEmpresa(id: number): Promise<void> {
    await db.delete(empresa).where(eq(empresa.id, id));
  }

  // Fornecedores
  async getAllFornecedores(): Promise<Fornecedor[]> {
    return await db.select().from(fornecedor).orderBy(asc(fornecedor.nome));
  }

  async getFornecedor(id: number): Promise<Fornecedor | undefined> {
    const [result] = await db.select().from(fornecedor).where(eq(fornecedor.id, id));
    return result || undefined;
  }

  async createFornecedor(data: InsertFornecedor): Promise<Fornecedor> {
    const [result] = await db.insert(fornecedor).values(data).returning();
    return result;
  }

  async updateFornecedor(id: number, data: Partial<InsertFornecedor>): Promise<Fornecedor> {
    const [result] = await db.update(fornecedor).set(data).where(eq(fornecedor.id, id)).returning();
    return result;
  }

  async deleteFornecedor(id: number): Promise<void> {
    await db.delete(fornecedor).where(eq(fornecedor.id, id));
  }

  // Plano de Contas
  async getAllPlanoContas(): Promise<PlanoContas[]> {
    return await db.select().from(planoContas).orderBy(asc(planoContas.codigo));
  }

  async getPlanoContas(id: number): Promise<PlanoContas | undefined> {
    const [result] = await db.select().from(planoContas).where(eq(planoContas.id, id));
    return result || undefined;
  }

  async createPlanoContas(data: InsertPlanoContas): Promise<PlanoContas> {
    const [result] = await db.insert(planoContas).values(data).returning();
    return result;
  }

  async updatePlanoContas(id: number, data: Partial<InsertPlanoContas>): Promise<PlanoContas> {
    const [result] = await db.update(planoContas).set(data).where(eq(planoContas.id, id)).returning();
    return result;
  }

  async deletePlanoContas(id: number): Promise<void> {
    await db.delete(planoContas).where(eq(planoContas.id, id));
  }

  // Tags
  async getAllTags(): Promise<Tag[]> {
    return await db.select().from(tag).orderBy(asc(tag.nome));
  }

  async getTag(id: number): Promise<Tag | undefined> {
    const [result] = await db.select().from(tag).where(eq(tag.id, id));
    return result || undefined;
  }

  async createTag(data: InsertTag): Promise<Tag> {
    const [result] = await db.insert(tag).values(data).returning();
    return result;
  }

  async updateTag(id: number, data: Partial<InsertTag>): Promise<Tag> {
    const [result] = await db.update(tag).set(data).where(eq(tag.id, id)).returning();
    return result;
  }

  async deleteTag(id: number): Promise<void> {
    await db.delete(tag).where(eq(tag.id, id));
  }

  // Contratos
  async getAllContratos(): Promise<Contrato[]> {
    return await db.select().from(contrato).orderBy(desc(contrato.id));
  }

  async getContrato(id: number): Promise<Contrato | undefined> {
    const [result] = await db.select().from(contrato).where(eq(contrato.id, id));
    return result || undefined;
  }

  async createContrato(data: InsertContrato): Promise<Contrato> {
    const [result] = await db.insert(contrato).values(data).returning();
    return result;
  }

  async updateContrato(id: number, data: Partial<InsertContrato>): Promise<Contrato> {
    const [result] = await db.update(contrato).set(data).where(eq(contrato.id, id)).returning();
    return result;
  }

  async deleteContrato(id: number): Promise<void> {
    await db.delete(contrato).where(eq(contrato.id, id));
  }

  // Títulos
  async getAllTitulos(): Promise<Titulo[]> {
    return await db.select().from(titulo).orderBy(desc(titulo.vencimento));
  }

  async getTitulo(id: number): Promise<Titulo | undefined> {
    const [result] = await db.select().from(titulo).where(eq(titulo.id, id));
    return result || undefined;
  }

  async createTitulo(data: InsertTitulo): Promise<Titulo> {
    const [result] = await db.insert(titulo).values(data).returning();
    return result;
  }

  async updateTitulo(id: number, data: Partial<InsertTitulo>): Promise<Titulo> {
    const [result] = await db.update(titulo).set(data).where(eq(titulo.id, id)).returning();
    return result;
  }

  async deleteTitulo(id: number): Promise<void> {
    await db.delete(titulo).where(eq(titulo.id, id));
  }

  // Títulos Baixa
  async getAllTitulosBaixa(): Promise<TituloBaixa[]> {
    return await db.select().from(tituloBaixa).orderBy(desc(tituloBaixa.dataBaixa));
  }

  async getTituloBaixa(id: number): Promise<TituloBaixa | undefined> {
    const [result] = await db.select().from(tituloBaixa).where(eq(tituloBaixa.id, id));
    return result || undefined;
  }

  async createTituloBaixa(data: InsertTituloBaixa): Promise<TituloBaixa> {
    const [result] = await db.insert(tituloBaixa).values(data).returning();
    return result;
  }

  async updateTituloBaixa(id: number, data: Partial<InsertTituloBaixa>): Promise<TituloBaixa> {
    const [result] = await db.update(tituloBaixa).set(data).where(eq(tituloBaixa.id, id)).returning();
    return result;
  }

  async deleteTituloBaixa(id: number): Promise<void> {
    await db.delete(tituloBaixa).where(eq(tituloBaixa.id, id));
  }

  // Dashboard specific queries
  async getDashboardData() {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    
    const hojeStr = hoje.toISOString().split('T')[0];
    const amanhaStr = amanha.toISOString().split('T')[0];

    // Títulos vencendo hoje
    const titulosHojeResult = await db.select({ count: sql<number>`count(*)` })
      .from(titulo)
      .where(and(
        eq(titulo.vencimento, hojeStr),
        eq(titulo.cancelado, false)
      ));

    // Valor em atraso
    const valorAtrasoResult = await db.select({ 
      total: sql<number>`COALESCE(SUM(${titulo.saldoPagar}), 0)` 
    })
      .from(titulo)
      .where(and(
        sql`${titulo.vencimento} < ${hojeStr}`,
        eq(titulo.cancelado, false),
        sql`${titulo.saldoPagar} > 0`
      ));

    // Vencimentos hoje
    const vencimentosHojeResult = await db.select({ 
      total: sql<number>`COALESCE(SUM(${titulo.saldoPagar}), 0)` 
    })
      .from(titulo)
      .where(and(
        eq(titulo.vencimento, hojeStr),
        eq(titulo.cancelado, false)
      ));

    // Vencimentos amanhã
    const vencimentosAmanhaResult = await db.select({ 
      total: sql<number>`COALESCE(SUM(${titulo.saldoPagar}), 0)` 
    })
      .from(titulo)
      .where(and(
        eq(titulo.vencimento, amanhaStr),
        eq(titulo.cancelado, false)
      ));

    // Próximos vencimentos (próximos 7 dias)
    const proximaDatasemana = new Date(hoje);
    proximaDatasemana.setDate(hoje.getDate() + 7);
    
    const proximosVencimentosResult = await db.select({
      id: titulo.id,
      numeroTitulo: titulo.numeroTitulo,
      fornecedor: fornecedor.nome,
      vencimento: titulo.vencimento,
      valor: titulo.saldoPagar
    })
      .from(titulo)
      .innerJoin(fornecedor, eq(titulo.idFornecedor, fornecedor.id))
      .where(and(
        gte(titulo.vencimento, hojeStr),
        lte(titulo.vencimento, proximaDatasemana.toISOString().split('T')[0]),
        eq(titulo.cancelado, false),
        sql`${titulo.saldoPagar} > 0`
      ))
      .orderBy(asc(titulo.vencimento))
      .limit(10);

    // Resumo por empresa
    const resumoEmpresasResult = await db.select({
      id: empresa.id,
      nome: empresa.nome,
      emAtraso: sql<number>`COALESCE(SUM(CASE WHEN ${titulo.vencimento} < ${hojeStr} THEN ${titulo.saldoPagar} ELSE 0 END), 0)`,
      venceHoje: sql<number>`COALESCE(SUM(CASE WHEN ${titulo.vencimento} = ${hojeStr} THEN ${titulo.saldoPagar} ELSE 0 END), 0)`,
      proximoVencimento: sql<number>`COALESCE(SUM(CASE WHEN ${titulo.vencimento} > ${hojeStr} THEN ${titulo.saldoPagar} ELSE 0 END), 0)`
    })
      .from(empresa)
      .leftJoin(titulo, and(
        eq(titulo.idEmpresa, empresa.id),
        eq(titulo.cancelado, false)
      ))
      .groupBy(empresa.id, empresa.nome)
      .orderBy(asc(empresa.nome));

    return {
      titulosHoje: titulosHojeResult[0]?.count || 0,
      valorAtraso: Number(valorAtrasoResult[0]?.total || 0),
      vencimentosHoje: Number(vencimentosHojeResult[0]?.total || 0),
      vencimentosAmanha: Number(vencimentosAmanhaResult[0]?.total || 0),
      proximosVencimentos: proximosVencimentosResult.map(item => ({
        id: item.id,
        numeroTitulo: item.numeroTitulo,
        fornecedor: item.fornecedor,
        vencimento: item.vencimento,
        valor: Number(item.valor)
      })),
      resumoEmpresas: resumoEmpresasResult.map(item => ({
        id: item.id,
        nome: item.nome,
        emAtraso: Number(item.emAtraso),
        venceHoje: Number(item.venceHoje),
        proximoVencimento: Number(item.proximoVencimento)
      }))
    };
  }
}

export const storage = new DatabaseStorage();
