# Configuração MySQL

## Status Atual
- ❌ Hostname `mysql8free-gestor-f.aivencloud.com` não é acessível do ambiente Replit
- ❌ Erro DNS: `getaddrinfo ENOTFOUND mysql8free-gestor-f.aivencloud.com`
- ✅ Porta configurada corretamente: 18411
- ✅ Certificado CA disponível: `ca.pem`
- ✅ Credenciais configuradas

## Possíveis Soluções

### 1. Usar IP Direto
Se você tiver o IP do servidor MySQL:
```bash
export MYSQL_HOST="IP_DO_SERVIDOR"
export MYSQL_PORT="18411"
export MYSQL_USER="avnadmin"
export MYSQL_PASSWORD="AVNS_mv1K1_d_Hr_ZbRKQWMs"
export MYSQL_DATABASE="pagamentos"
```

### 2. Configurar Proxy/Túnel
Se o servidor estiver em rede privada, você pode configurar:
- SSH tunnel
- VPN
- Proxy HTTP/HTTPS

### 3. Usar Serviço MySQL Alternativo
Configure um servidor MySQL acessível publicamente:
- PlanetScale
- Railway
- Aiven com configuração de rede pública

### 4. Testar Conectividade
Endpoint disponível para testar: `GET /api/mysql-status`

## Configuração Atual
```javascript
{
  host: "mysql8free-gestor-f.aivencloud.com",
  port: 18411,
  user: "avnadmin",
  password: "AVNS_mv1K1_d_Hr_ZbRKQWMs",
  database: "pagamentos",
  ssl: {
    rejectUnauthorized: false,
    ca: "ca.pem certificate"
  }
}
```

## Próximos Passos
1. Verificar se o servidor MySQL aceita conexões do IP atual do Replit
2. Configurar firewall para permitir conexões externas
3. Ou usar configuração alternativa com variáveis de ambiente