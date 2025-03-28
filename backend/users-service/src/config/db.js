require("dotenv").config();
const sql = require("mssql");

// Configuración de SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, 
        enableArithAbort: true,
    }
};

// Conectar a la base de datos
const connectDB = async () => {
    try {
        await sql.connect(dbConfig);
        console.log("Si se pudo conectar");
    } catch (error) {
        console.error("Error en la conexión: ", error);
    }
};

module.exports = { sql, connectDB };