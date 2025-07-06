// ============================================
// EXPORTAÇÃO DA CONEXÃO MYSQL PARA REPLIT
// ============================================
// 
// Para usar em outro projeto:
// 1. Instale a dependência: npm install mysql2
// 2. Defina a variável de ambiente MYSQL_PASSWORD no seu projeto
// 3. Importe e use este código
//
// ============================================

const mysql = require('mysql2/promise');

// Configuração da conexão MySQL
const dbConfig = {
    host: 'mysql8free-gestor.f.aivencloud.com',
    port: 18411,
    user: 'avnadmin',
    password: process.env.MYSQL_PASSWORD || '', // Defina esta variável no seu projeto
    database: 'pagamentos',
    ssl: {
        rejectUnauthorized: false // Necessário para conexão SSL
    },
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
};

// Pool de conexões para melhor performance
let pool = null;

function createPool() {
    if (!pool) {
        pool = mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}

// Função para obter uma conexão do pool
async function getConnection() {
    if (!pool) {
        createPool();
    }
    return await pool.getConnection();
}

// Função para testar a conexão
async function testConnection() {
    try {
        const connection = await getConnection();
        console.log('Conectado ao MySQL com sucesso!');
        connection.release();
        return true;
    } catch (error) {
        console.error('Erro ao conectar com MySQL:', error.message);
        return false;
    }
}

// Função para inicializar o banco e criar a tabela "empresa"
async function initializeDatabase() {
    try {
        const connection = await getConnection();
        
        // Criar tabela empresa se não existir
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS empresa (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                idade INT,
                status ENUM('ativo', 'inativo', 'pendente') DEFAULT 'ativo',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await connection.execute(createTableQuery);
        connection.release();
        
        console.log('Banco de dados inicializado com sucesso');
        console.log('Tabela "empresa" criada ou já existe');
        
        return true;
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        return false;
    }
}

// Classe principal para operações no banco
class MySQLStorage {
    // Buscar todos os registros
    async getAllRecords() {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM empresa ORDER BY id DESC');
            connection.release();
            return rows;
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
            throw error;
        }
    }
    
    // Buscar registro por ID
    async getRecordById(id) {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM empresa WHERE id = ?', [id]);
            connection.release();
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar registro por ID:', error);
            throw error;
        }
    }
    
    // Adicionar novo registro
    async addRecord(data) {
        try {
            const connection = await getConnection();
            const { nome, email, idade, status } = data;
            
            const [result] = await connection.execute(
                'INSERT INTO empresa (nome, email, idade, status) VALUES (?, ?, ?, ?)',
                [nome, email, idade || null, status || 'ativo']
            );
            
            // Buscar o registro criado
            const [rows] = await connection.execute('SELECT * FROM empresa WHERE id = ?', [result.insertId]);
            connection.release();
            
            return rows[0];
        } catch (error) {
            console.error('Erro ao adicionar registro:', error);
            throw error;
        }
    }
    
    // Atualizar registro existente
    async updateRecord(id, data) {
        try {
            const connection = await getConnection();
            const { nome, email, idade, status } = data;
            
            const [result] = await connection.execute(
                'UPDATE empresa SET nome = ?, email = ?, idade = ?, status = ? WHERE id = ?',
                [nome, email, idade || null, status || 'ativo', id]
            );
            
            if (result.affectedRows === 0) {
                connection.release();
                return null;
            }
            
            // Buscar o registro atualizado
            const [rows] = await connection.execute('SELECT * FROM empresa WHERE id = ?', [id]);
            connection.release();
            
            return rows[0];
        } catch (error) {
            console.error('Erro ao atualizar registro:', error);
            throw error;
        }
    }
    
    // Deletar registro
    async deleteRecord(id) {
        try {
            const connection = await getConnection();
            const [result] = await connection.execute('DELETE FROM empresa WHERE id = ?', [id]);
            connection.release();
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao deletar registro:', error);
            throw error;
        }
    }
    
    // Obter estatísticas da tabela
    async getStats() {
        try {
            const connection = await getConnection();
            const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM empresa');
            const [lastUpdatedResult] = await connection.execute('SELECT MAX(updated_at) as last_updated FROM empresa');
            connection.release();
            
            return {
                total_records: countResult[0].total,
                last_updated: lastUpdatedResult[0].last_updated
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw error;
        }
    }
}

// ============================================
// EXEMPLO DE USO
// ============================================

/*
// No seu projeto, use assim:

const { MySQLStorage, testConnection, initializeDatabase } = require('./mysql-connection-export');

async function exemploUso() {
    // Testar conexão
    const connected = await testConnection();
    if (!connected) {
        console.log('Falha na conexão');
        return;
    }
    
    // Inicializar banco (cria tabela se não existir)
    await initializeDatabase();
    
    // Usar a classe de storage
    const storage = new MySQLStorage();
    
    // Buscar todos os registros
    const registros = await storage.getAllRecords();
    console.log('Registros:', registros);
    
    // Adicionar novo registro
    const novoRegistro = await storage.addRecord({
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        idade: 25,
        status: 'ativo'
    });
    console.log('Novo registro:', novoRegistro);
    
    // Buscar por ID
    const registro = await storage.getRecordById(1);
    console.log('Registro ID 1:', registro);
    
    // Atualizar registro
    const atualizado = await storage.updateRecord(1, {
        nome: 'Empresa Atualizada',
        email: 'atualizada@empresa.com',
        idade: 30,
        status: 'ativo'
    });
    console.log('Registro atualizado:', atualizado);
    
    // Obter estatísticas
    const stats = await storage.getStats();
    console.log('Estatísticas:', stats);
    
    // Deletar registro
    const deletado = await storage.deleteRecord(1);
    console.log('Registro deletado:', deletado);
}

// Executar exemplo
exemploUso().catch(console.error);
*/

// ============================================
// EXPORTAÇÕES
// ============================================

module.exports = {
    MySQLStorage,
    testConnection,
    initializeDatabase,
    getConnection,
    createPool
};

// ============================================
// INSTRUÇÕES PARA USAR EM OUTRO PROJETO
// ============================================

/*
PASSO A PASSO:

1. Copie este arquivo para o seu projeto Replit

2. Instale a dependência MySQL:
   npm install mysql2

3. Configure a variável de ambiente MYSQL_PASSWORD:
   - No Replit: Vá em Secrets e adicione:
     Key: MYSQL_PASSWORD
     Value: [sua senha do MySQL]

4. Importe e use:
   const { MySQLStorage, testConnection, initializeDatabase } = require('./mysql-connection-export');

5. Inicialize e use:
   await testConnection();
   await initializeDatabase();
   const storage = new MySQLStorage();
   const registros = await storage.getAllRecords();

NOTAS IMPORTANTES:
- A tabela "empresa" será criada automaticamente
- Use sempre await com as funções async
- As conexões são gerenciadas automaticamente pelo pool
- SSL está configurado para o servidor MySQL específico
- Todas as operações incluem tratamento de erro
*/