import { pgTable, text, serial, integer, boolean, numeric, date, timestamp, bigint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const empresa = pgTable("empresa", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  cnpj: text("cnpj"),
});

export const fornecedor = pgTable("fornecedor", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  email: text("email"),
  telefone: text("telefone"),
  observacoes: text("observacoes"),
});

export const planoContas = pgTable("plano_conta", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  codigo: text("codigo").notNull(),
  nome: text("nome").notNull(),
  idContaPai: bigint("id_conta_pai", { mode: "number" }),
});

export const tag = pgTable("tag", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  cor: text("cor").notNull(),
});

export const contrato = pgTable("contrato", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  idEmpresa: bigint("id_empresa", { mode: "number" }),
  idFornecedor: bigint("id_fornecedor", { mode: "number" }),
  idPlanoContas: bigint("id_plano_conta", { mode: "number" }),
  descricao: text("descricao"),
  valorContrato: numeric("valor_contrato"),
  valorParcela: numeric("valor_parcela"),
  numParcela: bigint("num_parcela", { mode: "number" }),
  dataInicio: date("data_inicio"),
  diaVencimento: bigint("dia_vencimento", { mode: "number" }),
  parcelaInicial: bigint("parcela_inicial", { mode: "number" }),
  numeroTitulo: text("numero_titulo"),
  tipoMascara: bigint("tipo_mascara", { mode: "number" }),
  status: boolean("status"),
  observacoes: text("observacoes"),
});

export const titulo = pgTable("titulo", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  idEmpresa: bigint("id_empresa", { mode: "number" }).notNull(),
  idFornecedor: bigint("id_fornecedor", { mode: "number" }).notNull(),
  numeroTitulo: text("numero_titulo").notNull(),
  emissao: timestamp("emissao", { withTimezone: true }).notNull(),
  vencimento: date("vencimento").notNull(),
  valorTotal: numeric("valor_total").notNull().default("0"),
  saldoPagar: numeric("saldo_pagar").notNull().default("0"),
  idPlanoContas: bigint("id_plano_contas", { mode: "number" }).notNull(),
  descricao: text("descricao").notNull(),
  observacoes: text("observacoes"),
  cancelado: boolean("cancelado").default(false),
});

export const tituloBaixa = pgTable("titulo_baixa", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  idTitulo: bigint("id_titulo", { mode: "number" }).notNull(),
  dataBaixa: timestamp("data_baixa", { withTimezone: false }).notNull(),
  valorBaixa: numeric("valor_baixa").notNull().default("0"),
  valorPago: numeric("valor_pago").notNull().default("0"),
  juros: numeric("juros").notNull().default("0"),
  desconto: numeric("desconto").notNull().default("0"),
  observacao: text("observacao"),
  cancelado: boolean("cancelado").notNull().default(false),
});

export const contratoTag = pgTable("contrato_tag", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  idTag: bigint("id_tag", { mode: "number" }).notNull(),
  idContrato: bigint("id_contrato", { mode: "number" }).notNull(),
});

export const tituloTag = pgTable("titulo_tag", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  idTitulo: bigint("id_titulo", { mode: "number" }).notNull(),
  idTag: bigint("id_tag", { mode: "number" }).notNull(),
});

// Relations
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
export const insertEmpresaSchema = createInsertSchema(empresa).omit({ id: true });
export const insertFornecedorSchema = createInsertSchema(fornecedor).omit({ id: true });
export const insertPlanoContasSchema = createInsertSchema(planoContas).omit({ id: true });
export const insertTagSchema = createInsertSchema(tag).omit({ id: true });
export const insertContratoSchema = createInsertSchema(contrato).omit({ id: true });
export const insertTituloSchema = createInsertSchema(titulo).omit({ id: true });
export const insertTituloBaixaSchema = createInsertSchema(tituloBaixa).omit({ id: true });

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
