const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

router.use("/users/login", (req, res, next) => {
    console.log("Datos de la solicitud en API Gateway:", req.body);  
    next();  
});

// Rutas de Usuarios
router.use("/users", createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
        "^/users": "/"
    }
}));

// Proxy hacia el servicio de productos
router.use(
    "/products",
    createProxyMiddleware({
        target: "http://localhost:3002",
        changeOrigin: true,
        pathRewrite: { "^/products": "/" }
    })
);

module.exports = router;
