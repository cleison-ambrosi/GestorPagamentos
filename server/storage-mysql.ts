import { eq, asc, desc, sql } from "drizzle-orm";
import { db } from "./db";
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
  InsertConfiguracao,
  empresa,
  fornecedor,
  planoContas,
  tag,
  contrato,
  titulo,
  tituloBaixa,
  configuracao,
} from "@shared/schema";

// Simple MySQL storage implementation
export class MySQLStorage {
  // Empresas
  async getAllEmpresas(): Promise<Empresa[]> {
    return await db.select().from(empresa).orderBy(asc(empresa.nome));
  }

  async getEmpresa(id: number): Promise<Empresa | undefined> {
    const [result] = await db.select().from(empresa).where(eq(empresa.id, id));
    return result || undefined;
  }

  async createEmpresa(data: InsertEmpresa): Promise<Empresa> {
    const result = await db.insert(empresa).values(data);
    const [created] = await db.select().from(empresa).where(eq(empresa.id, Number((result as any).insertId)));
    return created;
  }

  async updateEmpresa(id: number, data: Partial<InsertEmpresa>): Promise<Empresa> {
    await db.update(empresa).set(data).where(eq(empresa.id, id));
    const [result] = await db.select().from(empresa).where(eq(empresa.id, id));
    return result;
  }

  async deleteEmpresa(id: number): Promise<void> {
    await db.delete(empresa).where(eq(empresa.id, id));
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
    const result = await db.insert(tag).values(data);
    const [created] = await db.select().from(tag).where(eq(tag.id, Number((result as any).insertId)));
    return created;
  }

  async updateTag(id: number, data: Partial<InsertTag>): Promise<Tag> {
    await db.update(tag).set(data).where(eq(tag.id, id));
    const [result] = await db.select().from(tag).where(eq(tag.id, id));
    return result;
  }

  async deleteTag(id: number): Promise<void> {
    await db.delete(tag).where(eq(tag.id, id));
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
    const result = await db.insert(fornecedor).values(data);
    const [created] = await db.select().from(fornecedor).where(eq(fornecedor.id, Number((result as any).insertId)));
    return created;
  }

  async updateFornecedor(id: number, data: Partial<InsertFornecedor>): Promise<Fornecedor> {
    await db.update(fornecedor).set(data).where(eq(fornecedor.id, id));
    const [result] = await db.select().from(fornecedor).where(eq(fornecedor.id, id));
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
    const result = await db.insert(planoContas).values(data);
    const [created] = await db.select().from(planoContas).where(eq(planoContas.id, Number((result as any).insertId)));
    return created;
  }

  async updatePlanoContas(id: number, data: Partial<InsertPlanoContas>): Promise<PlanoContas> {
    await db.update(planoContas).set(data).where(eq(planoContas.id, id));
    const [result] = await db.select().from(planoContas).where(eq(planoContas.id, id));
    return result;
  }

  async deletePlanoContas(id: number): Promise<void> {
    await db.delete(planoContas).where(eq(planoContas.id, id));
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
    const result = await db.insert(contrato).values(data);
    const [created] = await db.select().from(contrato).where(eq(contrato.id, Number((result as any).insertId)));
    return created;
  }

  async updateContrato(id: number, data: Partial<InsertContrato>): Promise<Contrato> {
    await db.update(contrato).set(data).where(eq(contrato.id, id));
    const [result] = await db.select().from(contrato).where(eq(contrato.id, id));
    return result;
  }

  async deleteContrato(id: number): Promise<void> {
    await db.delete(contrato).where(eq(contrato.id, id));
  }

  // Títulos
  async getAllTitulos(): Promise<Titulo[]> {
    return await db.select().from(titulo).orderBy(desc(titulo.id));
  }

  async getTitulo(id: number): Promise<Titulo | undefined> {
    const [result] = await db.select().from(titulo).where(eq(titulo.id, id));
    return result || undefined;
  }

  async createTitulo(data: InsertTitulo): Promise<Titulo> {
    const result = await db.insert(titulo).values(data);
    const [created] = await db.select().from(titulo).where(eq(titulo.id, Number((result as any).insertId)));
    return created;
  }

  async updateTitulo(id: number, data: Partial<InsertTitulo>): Promise<Titulo> {
    await db.update(titulo).set(data).where(eq(titulo.id, id));
    const [result] = await db.select().from(titulo).where(eq(titulo.id, id));
    return result;
  }

  async deleteTitulo(id: number): Promise<void> {
    await db.delete(titulo).where(eq(titulo.id, id));
  }

  // Títulos Baixa
  async getAllTitulosBaixa(): Promise<TituloBaixa[]> {
    return await db.select().from(tituloBaixa).orderBy(desc(tituloBaixa.id));
  }

  async getTituloBaixa(id: number): Promise<TituloBaixa | undefined> {
    const [result] = await db.select().from(tituloBaixa).where(eq(tituloBaixa.id, id));
    return result || undefined;
  }

  async createTituloBaixa(data: InsertTituloBaixa): Promise<TituloBaixa> {
    const result = await db.insert(tituloBaixa).values(data);
    const [created] = await db.select().from(tituloBaixa).where(eq(tituloBaixa.id, Number((result as any).insertId)));
    return created;
  }

  async updateTituloBaixa(id: number, data: Partial<InsertTituloBaixa>): Promise<TituloBaixa> {
    await db.update(tituloBaixa).set(data).where(eq(tituloBaixa.id, id));
    const [result] = await db.select().from(tituloBaixa).where(eq(tituloBaixa.id, id));
    return result;
  }

  async deleteTituloBaixa(id: number): Promise<void> {
    await db.delete(tituloBaixa).where(eq(tituloBaixa.id, id));
  }

  // Dashboard específico
  async getDashboardData() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      titulosHoje: 0,
      valorAtraso: 0,
      vencimentosHoje: 0,
      vencimentosAmanha: 0,
      proximosVencimentos: [],
      resumoEmpresas: await db.select({
        id: empresa.id,
        nome: empresa.nome,
        emAtraso: sql<number>`0`,
        venceHoje: sql<number>`0`,
        proximoVencimento: sql<number>`0`,
      }).from(empresa),
    };
  }

  // Configurações
  async getConfiguracao(): Promise<Configuracao | undefined> {
    const [result] = await db.select().from(configuracao).limit(1);
    return result || undefined;
  }

  async createConfiguracao(data: InsertConfiguracao): Promise<Configuracao> {
    const result = await db.insert(configuracao).values(data);
    const [created] = await db.select().from(configuracao).where(eq(configuracao.id, Number((result as any).insertId)));
    return created;
  }

  async updateConfiguracao(id: number, data: Partial<InsertConfiguracao>): Promise<Configuracao> {
    await db.update(configuracao).set(data).where(eq(configuracao.id, id));
    const [result] = await db.select().from(configuracao).where(eq(configuracao.id, id));
    return result;
  }

  async updateEmpresaContratos(idEmpresa: number): Promise<void> {
    // Implementação específica se necessário
  }

  async updateEmpresaTitulos(idEmpresa: number): Promise<void> {
    // Implementação específica se necessário
  }
}

export const storage = new MySQLStorage();