const app = require("./src/app");

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});