const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.use("/", routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
