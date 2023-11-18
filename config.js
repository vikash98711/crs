const sql = require('mssql');
require('dotenv').config();


// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };

const connectionString = process.env.DATABASE_URL || `mssql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}`;

const config = {
  connectionString: connectionString,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};





const checkDbConnection = async () => {
  try {
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

module.exports = { checkDbConnection };