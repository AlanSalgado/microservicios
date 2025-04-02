const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const { connectDB } = require("./config/db");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rutas de Productos
app.use("/", productRoutes);

// Conectar a la base de datos de productos
connectDB();

module.exports = app;