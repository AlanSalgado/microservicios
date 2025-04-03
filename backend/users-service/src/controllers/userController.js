const { sql } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getAllUsers = async(req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query("SELECT id, name, email, created_at FROM Users");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async(req, res) => {
    try {
        const request = new sql.Request();
        request.input("id", sql.Int, req.params.id);
        const result = await request.query("SELECT id, name, email, created_at FROM Users WHERE id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async(req, res) => {
    const { name, email, password } = req.body;
    try {
        // Cifras la pass
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const request = new sql.Request();
        request.input("name", sql.NVarChar, name);
        request.input("email", sql.NVarChar, email);
        request.input("password", sql.NVarChar, hashPass);

        await request.query("INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)");

        // Generar token
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "Usuario Creado", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    console.log("Datos recibidos:", req.body);
    const { email, password } = req.body;

    try {
        const request = new sql.Request();
        request.input("email", sql.NVarChar, email);
        const result = await request.query("SELECT * FROM Users WHERE email = @email");

        // Verificar que exista el usuario
        if(result.recordset.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Contraseña icnorrecta" });
        }

        // Generar el token
        const token = jwt.sign(
            { email: user.email, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async(req, res) => {
    const { name, email, password } = req.body;
    try {
        const request = new sql.Request();
        request.input("id", sql.Int, req.params.id);

        let updates = [];
        if (name) request.input("name", sql.NVarChar, name), updates.push("name = @name");
        if (email) request.input("email", sql.NVarChar, email), updates.push("email = @email");
        if (password) request.input("password", sql.NVarChar, password), updates.push("password = @password");

        if (updates.length > 0) {
            await request.query(`UPDATE Users SET ${updates.join(", ")} WHERE id = @id`);
            res.json({ message: "Usuario actualizado" });
        } else {
            res.status(400).json({ message: "No se enviaron campos para actualizar" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async(req, res) => {
    try {
        const request = new sql.Request();
        request.input("id", sql.Int, req.params.id);
        await request.query("DELETE FROM Users WHERE id = @id");
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, getUserById, createUser, loginUser, updateUser, deleteUser };