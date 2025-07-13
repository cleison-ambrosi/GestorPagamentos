# Sistema de Gestão de Contas a Pagar

Sistema completo de gestão financeira para empresas brasileiras, especializado em contratos e processamento de transações com tratamento avançado de erros.

## Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** - Build tool moderno
- **Wouter** - Roteamento leve
- **TanStack Query** - Gerenciamento de estado de servidor
- **Tailwind CSS** + **shadcn/ui** - Estilização
- **Radix UI** - Componentes acessíveis

### Backend
- **Node.js** com **Express.js**
- **TypeScript**
- **Drizzle ORM** - ORM type-safe
- **MySQL** (Aiven Cloud) - Banco de dados
- **Zod** - Validação de dados

### Ferramentas
- **ESBuild** - Bundling
- **Drizzle Kit** - Migrações
- **Docker** - Containerização

## Funcionalidades

- ✅ Gestão completa de contratos
- ✅ Controle de fornecedores
- ✅ Títulos e baixas de pagamento
- ✅ Dashboard com métricas financeiras
- ✅ Relatórios personalizados
- ✅ Sistema de cancelamento inteligente
- ✅ Atualizações em cascata
- ✅ Interface responsiva

## Deploy

### Variáveis de Ambiente Necessárias

```bash
NODE_ENV=production
DATABASE_URL=your_database_url
MYSQL_HOST=your_mysql_host
MYSQL_PORT=your_mysql_port
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_mysql_database
MYSQL_SSL=true
```

### Deploy com Docker

```bash
# Build da imagem
docker build -t contas-pagar .

# Executar container
docker run -p 5000:5000 --env-file .env contas-pagar
```

### Deploy com Docker Compose

```bash
docker-compose up -d
```

### Deploy no Coolify

1. Conecte seu repositório Git
2. Configure as variáveis de ambiente
3. Adicione o arquivo `ca.pem` nos volumes
4. Configure o domínio e SSL
5. Deploy automático

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Sincronizar banco de dados
npm run db:push
```

## Estrutura do Projeto

```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Tipos e schemas compartilhados
├── ca.pem          # Certificado SSL MySQL
├── Dockerfile      # Configuração Docker
└── docker-compose.yml
```

## Banco de Dados

O sistema utiliza MySQL com SSL habilitado e estrutura normalizada para:
- Empresas e fornecedores
- Contratos e títulos
- Plano de contas
- Histórico de baixas
- Sistema de tags e configurações