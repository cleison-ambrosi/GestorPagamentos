# Configuração MySQL com IP Direto

## Problema Identificado
O hostname `mysql8free-gestor-f.aivencloud.com` não pode ser resolvido pelo DNS no ambiente Replit.

## Solução: Usar IP Direto

### 1. Descobrir o IP do servidor MySQL
Execute um dos comandos abaixo em sua máquina local (fora do Replit):

```bash
# Linux/Mac
nslookup mysql8free-gestor-f.aivencloud.com

# Windows
nslookup mysql8free-gestor-f.aivencloud.com

# Online
# Use um site como: https://www.whatsmydns.net/
```

### 2. Configurar variáveis de ambiente no Replit

No seu projeto Replit, configure as seguintes variáveis:

```bash
MYSQL_HOST=IP_DO_SERVIDOR_MYSQL
MYSQL_PORT=18411
MYSQL_USER=avnadmin
MYSQL_PASSWORD=AVNS_mv1K1_d_Hr_ZbRKQWMs
MYSQL_DATABASE=pagamentos
```

### 3. Exemplo de configuração
Se o IP do servidor for `192.168.1.100`, configure:

```bash
MYSQL_HOST=192.168.1.100
MYSQL_PORT=18411
MYSQL_USER=avnadmin
MYSQL_PASSWORD=AVNS_mv1K1_d_Hr_ZbRKQWMs
MYSQL_DATABASE=pagamentos
```

## Status do Certificado SSL ✓
- O certificado `ca.pem` está sendo usado corretamente
- A configuração SSL está implementada
- O problema é apenas de resolução DNS

## Verificação da Conexão
- Acesse a página "Config MySQL" no menu lateral
- Monitore o status da conexão em tempo real
- Verifique se os erros mudaram após configurar o IP

## Alternativas
1. **Usar outro servidor MySQL**: Configure um servidor MySQL acessível publicamente
2. **MySQL Local**: Use um servidor MySQL local no Replit (limitado)
3. **Serviço MySQL na nuvem**: Use serviços como PlanetScale, Railway, ou Supabase