const { sql } = require("../config/db");

const getAllProducts = async(req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query("SELECT id, name, price, stock FROM Products");
        res.json(result.recordset);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async(req, res) => {
    try {
        const request = new sql.Request();
        request.input("id", sql.Int, req.params.id);
        const result = await request.query("SELECT id, name, price, stock FROM Products WHERE id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async(req, res) => {
    const { name, price, stock } = req.body;
    try {
        const request = new sql.Request();
        request.input("name", sql.NVarChar, name);
        request.input("price", sql.Decimal, price);
        request.input("stock", sql.Int, stock);

        await request.query("INSER INTO Products (name, price, stock) VALUES (@name, @price, @stock)");
        res.status(201).json({ message: "Producto Creado" });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async(req, res) => {
    const { name, price, stock } = req.body;
    try {
        const request = new sql.Request();
        request.input("id", sql.Int, req.params.id);

        let updates = [];
        if (name) request.input("name", sql.NVarChar, name), updates.push("name = @name");
        if (price) request.input("price", sql.Decimal, price), updates.push("price = @price");
        if (stock) request.input("stock", sql.Int, stock), updates.push("stock = @stock");

        if (updates.length > 0) {
            await request.query(`UPDATE Products SET ${updates.join(", ")} WHERE id = @id`);
            res.json({ message: "Producto actualizado" });
        } else {
            res.status(400).json({ message: "No se enviaron campos para actualizar" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async(req, res) => {
    try {
        const request = new sql.Request();
        request.input("id", sql.Int, req.params.id);
        await request.query("DELETE FROM Products WHERE id = @id");
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };