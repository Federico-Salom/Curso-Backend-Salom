const fs = require("fs");
const path = require("path");
const express = require("express");
const ProductManager = require("./productManager");

const app = express();
const port = 3000;

const archivoProductos = "Productos.JSON";
const rutaProductos = path.join(__dirname, "../archivos", archivoProductos);

const productManager = new ProductManager(rutaProductos);

// Endpoint para obtener productos con límite opcional
app.get("/products", (req, res) => {
    const { limit } = req.query;

    let productos = productManager.getProductos();

    if (limit) {
        const limiteNumerico = parseInt(limit);
        productos = productos.slice(0, limiteNumerico);
    }

    res.json(productos);
});

app.get("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
      const product = productManager.getProductById(productId);
      res.json(product);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
});


/* try {
  productManager.addProduct("Teclado", "Mecanico", 250, "img", 53425, 20);
  productManager.addProduct("Mouse", "Óptico", 150, "img", 12345, 15);
  productManager.addProduct("Monitor", "Full HD", 1000, "img", 67890, 5);
} catch (error) {
  console.error("Error al agregar productos:", error.message);
} */


app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
