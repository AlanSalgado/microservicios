const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

app.use(
    "/users", 
    createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true,
        pathRewrite: {
            [`^/users`]: '',
        },
    })
);

app.use(
    "/products", 
    createProxyMiddleware({
        target: "http://localhost:3002",
        changeOrigin: true,
        pathRewrite: {
            [`^/products`]: '',
        },
    })
);

app.listen(PORT, () => {
    console.log(`API Gateway corriendo en http://localhost:${PORT}`);
})