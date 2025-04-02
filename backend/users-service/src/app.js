const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { connectDB } = require("./config/db");

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rutas de Usuarios
app.use("/", userRoutes);

// Conectar a la base de datos de usuarios
connectDB();

module.exports = app;
