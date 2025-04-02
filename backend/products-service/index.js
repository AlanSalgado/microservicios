const app = require("./src/app");

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Servicio de productos corriendo en http://localhost:${PORT}`);
});