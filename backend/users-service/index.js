const app = require("./src/app");

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servicio de usuarios corriendo en http://localhost:${PORT}`);
});
