import { eq, asc, desc, sql, and, ne, gte, lte } from "drizzle-orm";
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

import { IStorage } from "./storage";

// Simple MySQL storage implementation
export class MySQLStorage implements IStorage {
  // Empresas
  async getAllEmpresas(): Promise<Empresa[]> {
    return await db.select().from(empresa).orderBy(asc(empresa.nome));
  }

  async getEmpresa(id: number): Promise<Empresa | undefined> {
    const [result] = await db.select().from(empresa).where(eq(empresa.id, id));
    return result || undefined;
  }

  async createEmpresa(data: InsertEmpresa): Promise<Empresa> {
    console.log('Executando inserção MySQL para empresa:', data);
    
    try {
      const result = await db.insert(empresa).values(data);
      console.log('Resultado da inserção MySQL:', result);
      
      // Buscar o último registro inserido ordenado por ID
      const [created] = await db.select().from(empresa).orderBy(desc(empresa.id)).limit(1);
      console.log('Empresa criada encontrada:', created);
      
      if (!created) {
        throw new Error('Falha ao criar empresa - não foi possível recuperar registro');
      }
      
      return created;
    } catch (error) {
      console.error('Erro detalhado na criação de empresa:', error);
      throw error;
    }
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
    console.log('Executando inserção MySQL para tag:', data);
    
    try {
      const result = await db.insert(tag).values(data);
      console.log('Resultado da inserção MySQL:', result);
      
      // Buscar o último registro inserido ordenado por ID
      const [created] = await db.select().from(tag).orderBy(desc(tag.id)).limit(1);
      console.log('Tag criada encontrada:', created);
      
      if (!created) {
        throw new Error('Falha ao criar tag - não foi possível recuperar registro');
      }
      
      return created;
    } catch (error) {
      console.error('Erro detalhado na criação de tag:', error);
      throw error;
    }
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
    console.log('Executando inserção MySQL para fornecedor:', data);
    
    try {
      const result = await db.insert(fornecedor).values(data);
      console.log('Resultado da inserção MySQL:', result);
      
      // Buscar o último registro inserido ordenado por ID
      const [created] = await db.select().from(fornecedor).orderBy(desc(fornecedor.id)).limit(1);
      console.log('Fornecedor criado encontrado:', created);
      
      if (!created) {
        throw new Error('Falha ao criar fornecedor - não foi possível recuperar registro');
      }
      
      return created;
    } catch (error) {
      console.error('Erro detalhado na criação de fornecedor:', error);
      throw error;
    }
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
    console.log('Executando inserção MySQL para plano de contas:', data);
    
    try {
      const result = await db.insert(planoContas).values(data);
      console.log('Resultado da inserção MySQL:', result);
      
      // Buscar o último registro inserido ordenado por ID
      const [created] = await db.select().from(planoContas).orderBy(desc(planoContas.id)).limit(1);
      console.log('Plano de contas criado encontrado:', created);
      
      if (!created) {
        throw new Error('Falha ao criar plano de contas - não foi possível recuperar registro');
      }
      
      return created;
    } catch (error) {
      console.error('Erro detalhado na criação de plano de contas:', error);
      throw error;
    }
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
    const result = await db
      .select({
        id: contrato.id,
        idEmpresa: contrato.idEmpresa,
        idFornecedor: contrato.idFornecedor,
        idPlanoContas: contrato.idPlanoContas,
        descricao: contrato.descricao,
        valorContrato: contrato.valorContrato,
        valorParcela: contrato.valorParcela,
        numParcela: contrato.numParcela,
        dataInicio: contrato.dataInicio,
        diaVencimento: contrato.diaVencimento,
        parcelaInicial: contrato.parcelaInicial,
        numeroTitulo: contrato.numeroTitulo,
        mascara: contrato.mascara,
        status: contrato.status,
        observacoes: contrato.observacoes,
        empresa: empresa.nome,
        fornecedor: fornecedor.nome,
      })
      .from(contrato)
      .leftJoin(empresa, eq(contrato.idEmpresa, empresa.id))
      .leftJoin(fornecedor, eq(contrato.idFornecedor, fornecedor.id))
      .orderBy(desc(contrato.id));
    
    return result as any[];
  }

  async getContrato(id: number): Promise<Contrato | undefined> {
    const [result] = await db.select().from(contrato).where(eq(contrato.id, id));
    return result || undefined;
  }

  async createContrato(data: InsertContrato): Promise<Contrato> {
    const result = await db.insert(contrato).values(data);
    const insertId = (result as any)[0].insertId;
    const [created] = await db.select().from(contrato).where(eq(contrato.id, insertId));
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
    return await db.select({
      id: titulo.id,
      idEmpresa: titulo.idEmpresa,
      idFornecedor: titulo.idFornecedor,
      numeroTitulo: titulo.numeroTitulo,
      emissao: titulo.emissao,
      vencimento: titulo.vencimento,
      valorTotal: titulo.valorTotal,
      saldoPagar: titulo.saldoPagar,
      idPlanoContas: titulo.idPlanoContas,
      descricao: titulo.descricao,
      observacoes: titulo.observacoes,
      status: titulo.status,
      fornecedor: fornecedor.nome,
    }).from(titulo)
      .leftJoin(fornecedor, eq(titulo.idFornecedor, fornecedor.id))
      .orderBy(desc(titulo.id));
  }

  async getTitulo(id: number): Promise<Titulo | undefined> {
    const [result] = await db.select().from(titulo).where(eq(titulo.id, id));
    return result || undefined;
  }

  async createTitulo(data: InsertTitulo): Promise<Titulo> {
    const result = await db.insert(titulo).values(data);
    const insertId = (result as any)[0].insertId;
    const [created] = await db.select().from(titulo).where(eq(titulo.id, insertId));
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
    // First, insert the baixa record
    const result = await db.insert(tituloBaixa).values(data);
    const insertId = (result as any)[0].insertId;
    const [created] = await db.select().from(tituloBaixa).where(eq(tituloBaixa.id, insertId));
    
    // Then, update the título status and saldo
    await this.updateTituloAfterBaixa(data.idTitulo);
    
    return created;
  }

  private async updateTituloAfterBaixa(idTitulo: number): Promise<void> {
    // Get the título
    const [tituloAtual] = await db.select().from(titulo).where(eq(titulo.id, idTitulo));
    if (!tituloAtual) return;

    // Get all baixas for this título
    const baixas = await db.select().from(tituloBaixa)
      .where(and(eq(tituloBaixa.idTitulo, idTitulo), eq(tituloBaixa.cancelado, false)));

    // Calculate total paid
    const totalPago = baixas.reduce((sum, baixa) => 
      sum + parseFloat(baixa.valorPago.toString()), 0
    );

    const valorTotal = parseFloat(tituloAtual.valorTotal.toString());
    const novoSaldo = valorTotal - totalPago;

    // Determine new status
    let novoStatus = 1; // Em Aberto
    if (novoSaldo <= 0) {
      novoStatus = 3; // Pago
    } else if (totalPago > 0) {
      novoStatus = 2; // Parcial
    }

    // Update título
    await db.update(titulo).set({
      saldoPagar: novoSaldo.toFixed(2),
      status: novoStatus
    }).where(eq(titulo.id, idTitulo));
  }

  async updateTituloBaixa(id: number, data: Partial<InsertTituloBaixa>): Promise<TituloBaixa> {
    await db.update(tituloBaixa).set(data).where(eq(tituloBaixa.id, id));
    const [result] = await db.select().from(tituloBaixa).where(eq(tituloBaixa.id, id));
    return result;
  }

  async deleteTituloBaixa(id: number): Promise<void> {
    await db.delete(tituloBaixa).where(eq(tituloBaixa.id, id));
  }

  // Dashboard específico - implementação temporária
  async getDashboardData() {
    return {
      titulosHoje: 0,
      valorAtraso: 0,
      vencimentosHoje: 0,
      vencimentosAmanha: 0,
      proximosVencimentos: [],
      resumoEmpresas: []
    };
  }

  // Configurações
  async getConfiguracao(): Promise<Configuracao | undefined> {
    const [result] = await db.select().from(configuracao).limit(1);
    return result || undefined;
  }

  async createConfiguracao(data: InsertConfiguracao): Promise<Configuracao> {
    const result = await db.insert(configuracao).values(data);
    const insertId = (result as any)[0].insertId;
    const [created] = await db.select().from(configuracao).where(eq(configuracao.id, insertId));
    return created;
  }

  async updateConfiguracao(id: number, data: Partial<InsertConfiguracao>): Promise<Configuracao> {
    await db.update(configuracao).set(data).where(eq(configuracao.id, id));
    const [result] = await db.select().from(configuracao).where(eq(configuracao.id, id));
    return result;
  }

  async updateEmpresaContratos(idEmpresa: number): Promise<void> {
    // Verificar se já existe configuração
    const existing = await this.getConfiguracao();
    
    if (existing) {
      await this.updateConfiguracao(existing.id, { idEmpresaContratos: idEmpresa });
    } else {
      await this.createConfiguracao({ idEmpresaContratos: idEmpresa });
    }
  }

  async updateEmpresaTitulos(idEmpresa: number): Promise<void> {
    // Verificar se já existe configuração
    const existing = await this.getConfiguracao();
    
    if (existing) {
      await this.updateConfiguracao(existing.id, { idEmpresaTitulos: idEmpresa });
    } else {
      await this.createConfiguracao({ idEmpresaTitulos: idEmpresa });
    }
  }
}

export const storage = new MySQLStorage();