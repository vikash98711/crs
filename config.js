const sql = require('mssql');
require('dotenv').config();

const checkDbConnection = async () => {
  try {
    const config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    };

    const pool = await sql.connect(config);

    if (pool.connected) {
      console.log('Database connection successful');
      return pool;
    } else {
      console.log('Database connection failed');
    }
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};

// Call the function
checkDbConnection();

module.exports = checkDbConnection;
