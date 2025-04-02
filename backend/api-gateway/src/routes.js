const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

// Proxy hacia el servicio de usuarios
router.use(
    "/users",
    createProxyMiddleware({
        target: "http://localhost:3001/users",
        changeOrigin: true
    })
)

// Proxy hacia el servicio de productos
router.use(
    "/products",
    createProxyMiddleware({
        target: "http://localhost:3002/products",
        changeOrigin: true,
    })
);

module.exports = router;