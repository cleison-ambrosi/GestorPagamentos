
import { pgTable, text, serial, integer, boolean, decimal, date, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const empresa = pgTable("empresa", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cnpj: text("cnpj"),
});

export const fornecedor = mysqlTable("fornecedor", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  nome: text("nome").notNull(),
  email: text("email"),
  telefone: text("telefone"),
  observacoes: text("observacoes"),
});

export const planoContas = mysqlTable("plano_conta", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  codigo: text("codigo").notNull(),
  nome: text("nome").notNull(),
  idContaPai: bigint("id_conta_pai", { mode: "number" }),
});

export const tag = mysqlTable("tag", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  nome: text("nome").notNull(),
  cor: text("cor").notNull(),
});

export const configuracao = mysqlTable("configuracao", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  idEmpresaContratos: bigint("id_empresa_contratos", { mode: "number" }),
  idEmpresaTitulos: bigint("id_empresa_titulos", { mode: "number" }),
});

export const contrato = mysqlTable("contrato", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  idEmpresa: bigint("id_empresa", { mode: "number" }),
  idFornecedor: bigint("id_fornecedor", { mode: "number" }),
  idPlanoContas: bigint("id_plano_conta", { mode: "number" }),
  descricao: text("descricao"),
  valorContrato: decimal("valor_contrato", { precision: 10, scale: 2 }),
  valorParcela: decimal("valor_parcela", { precision: 10, scale: 2 }),
  numParcela: bigint("num_parcela", { mode: "number" }),
  dataInicio: date("data_inicio"),
  diaVencimento: bigint("dia_vencimento", { mode: "number" }),
  parcelaInicial: bigint("parcela_inicial", { mode: "number" }),
  numeroTitulo: text("numero_titulo"),
  tipoMascara: bigint("tipo_mascara", { mode: "number" }),
  status: boolean("status"),
  observacoes: text("observacoes"),
});

export const titulo = mysqlTable("titulo", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  idEmpresa: bigint("id_empresa", { mode: "number" }).notNull(),
  idFornecedor: bigint("id_fornecedor", { mode: "number" }).notNull(),
  numeroTitulo: text("numero_titulo").notNull(),
  emissao: timestamp("emissao").notNull(),
  vencimento: date("vencimento").notNull(),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull().default("0"),
  saldoPagar: decimal("saldo_pagar", { precision: 10, scale: 2 }).notNull().default("0"),
  idPlanoContas: bigint("id_plano_contas", { mode: "number" }).notNull(),
  descricao: text("descricao").notNull(),
  observacoes: text("observacoes"),
  cancelado: boolean("cancelado").default(false),
});

export const tituloBaixa = mysqlTable("titulo_baixa", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  idTitulo: bigint("id_titulo", { mode: "number" }).notNull(),
  dataBaixa: timestamp("data_baixa").notNull(),
  valorBaixa: decimal("valor_baixa", { precision: 10, scale: 2 }).notNull().default("0"),
  valorPago: decimal("valor_pago", { precision: 10, scale: 2 }).notNull().default("0"),
  juros: decimal("juros", { precision: 10, scale: 2 }).notNull().default("0"),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).notNull().default("0"),
  observacao: text("observacao"),
  cancelado: boolean("cancelado").notNull().default(false),
});

export const contratoTag = mysqlTable("contrato_tag", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  idTag: bigint("id_tag", { mode: "number" }).notNull(),
  idContrato: bigint("id_contrato", { mode: "number" }).notNull(),
});

export const tituloTag = mysqlTable("titulo_tag", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  idTitulo: bigint("id_titulo", { mode: "number" }).notNull(),
  idTag: bigint("id_tag", { mode: "number" }).notNull(),
});

// Relations (mantêm a mesma estrutura)
export const empresaRelations = relations(empresa, ({ many }) => ({
  contratos: many(contrato),
  titulos: many(titulo),
}));

export const fornecedorRelations = relations(fornecedor, ({ many }) => ({
  contratos: many(contrato),
  titulos: many(titulo),
}));

export const planoContasRelations = relations(planoContas, ({ one, many }) => ({
  contaPai: one(planoContas, {
    fields: [planoContas.idContaPai],
    references: [planoContas.id],
  }),
  contratos: many(contrato),
  titulos: many(titulo),
}));

export const contratoRelations = relations(contrato, ({ one, many }) => ({
  empresa: one(empresa, {
    fields: [contrato.idEmpresa],
    references: [empresa.id],
  }),
  fornecedor: one(fornecedor, {
    fields: [contrato.idFornecedor],
    references: [fornecedor.id],
  }),
  planoContas: one(planoContas, {
    fields: [contrato.idPlanoContas],
    references: [planoContas.id],
  }),
  tags: many(contratoTag),
}));

export const tituloRelations = relations(titulo, ({ one, many }) => ({
  empresa: one(empresa, {
    fields: [titulo.idEmpresa],
    references: [empresa.id],
  }),
  fornecedor: one(fornecedor, {
    fields: [titulo.idFornecedor],
    references: [fornecedor.id],
  }),
  planoContas: one(planoContas, {
    fields: [titulo.idPlanoContas],
    references: [planoContas.id],
  }),
  baixas: many(tituloBaixa),
  tags: many(tituloTag),
}));

export const tituloBaixaRelations = relations(tituloBaixa, ({ one }) => ({
  titulo: one(titulo, {
    fields: [tituloBaixa.idTitulo],
    references: [titulo.id],
  }),
}));

export const contratoTagRelations = relations(contratoTag, ({ one }) => ({
  contrato: one(contrato, {
    fields: [contratoTag.idContrato],
    references: [contrato.id],
  }),
  tag: one(tag, {
    fields: [contratoTag.idTag],
    references: [tag.id],
  }),
}));

export const tituloTagRelations = relations(tituloTag, ({ one }) => ({
  titulo: one(titulo, {
    fields: [tituloTag.idTitulo],
    references: [titulo.id],
  }),
  tag: one(tag, {
    fields: [tituloTag.idTag],
    references: [tag.id],
  }),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  contratos: many(contratoTag),
  titulos: many(tituloTag),
}));

// Insert schemas
export const insertEmpresaSchema = createInsertSchema(empresa);
export const insertFornecedorSchema = createInsertSchema(fornecedor);
export const insertPlanoContasSchema = createInsertSchema(planoContas);
export const insertTagSchema = createInsertSchema(tag);
export const insertContratoSchema = createInsertSchema(contrato);
export const insertTituloSchema = createInsertSchema(titulo);
export const insertTituloBaixaSchema = createInsertSchema(tituloBaixa);
export const insertConfiguracaoSchema = createInsertSchema(configuracao);

// Types
export type Empresa = typeof empresa.$inferSelect;
export type InsertEmpresa = z.infer<typeof insertEmpresaSchema>;
export type Fornecedor = typeof fornecedor.$inferSelect;
export type InsertFornecedor = z.infer<typeof insertFornecedorSchema>;
export type PlanoContas = typeof planoContas.$inferSelect;
export type InsertPlanoContas = z.infer<typeof insertPlanoContasSchema>;
export type Tag = typeof tag.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Contrato = typeof contrato.$inferSelect;
export type InsertContrato = z.infer<typeof insertContratoSchema>;
export type Titulo = typeof titulo.$inferSelect;
export type InsertTitulo = z.infer<typeof insertTituloSchema>;
export type TituloBaixa = typeof tituloBaixa.$inferSelect;
export type InsertTituloBaixa = z.infer<typeof insertTituloBaixaSchema>;
export type Configuracao = typeof configuracao.$inferSelect;
export type InsertConfiguracao = z.infer<typeof insertConfiguracaoSchema>;
