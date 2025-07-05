const mysql = require('mysql2/promise');
const fs = require('fs');

// Test different connection methods
const testConfigs = [
  {
    name: 'Original hostname with CA cert',
    config: {
      host: "mysql8free-gestor-f.aivencloud.com",
      port: 18411,
      user: "avnadmin", 
      password: "AVNS_mv1K1_d_Hr_ZbRKQWMs",
      database: "pagamentos",
      ssl: {
        rejectUnauthorized: false,
        ca: fs.existsSync('./ca.pem') ? fs.readFileSync('./ca.pem') : undefined
      },
      connectTimeout: 10000
    }
  },
  {
    name: 'Direct IP (if available)',
    config: {
      host: "35.228.45.209", // This is a placeholder - you'll need the actual IP
      port: 18411,
      user: "avnadmin", 
      password: "AVNS_mv1K1_d_Hr_ZbRKQWMs",
      database: "pagamentos",
      ssl: {
        rejectUnauthorized: false,
        ca: fs.existsSync('./ca.pem') ? fs.readFileSync('./ca.pem') : undefined
      },
      connectTimeout: 10000
    }
  },
  {
    name: 'Without SSL',
    config: {
      host: "mysql8free-gestor-f.aivencloud.com",
      port: 18411,
      user: "avnadmin", 
      password: "AVNS_mv1K1_d_Hr_ZbRKQWMs",
      database: "pagamentos",
      ssl: false,
      connectTimeout: 10000
    }
  }
];

async function testConnections() {
  for (const test of testConfigs) {
    console.log(`\n🔍 Testing: ${test.name}`);
    try {
      const connection = await mysql.createConnection(test.config);
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log(`✅ Success: ${test.name}`);
      await connection.end();
      return test.config; // Return working config
    } catch (err) {
      console.log(`❌ Failed: ${test.name} - ${err.message}`);
    }
  }
  return null;
}

testConnections()
  .then(workingConfig => {
    if (workingConfig) {
      console.log('\n🎉 Found working configuration!');
      console.log('Use this configuration in your db.ts file');
    } else {
      console.log('\n🚫 No working configuration found');
      console.log('Please check:');
      console.log('1. MySQL server is running and accessible');
      console.log('2. Firewall allows connections from this IP');
      console.log('3. Credentials are correct');
      console.log('4. Network connectivity to the MySQL server');
    }
  })
  .catch(console.error);