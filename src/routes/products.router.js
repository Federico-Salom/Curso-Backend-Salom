// Librerias
const { Router } = require("express");
const router = Router();


// Ruta de archivos
const express = require("express");
const path = require("path");
const ProductManager = require("../public/scripts/productManager");
const cartRouter = require("../public/scripts/cartRoutes");



// Productos
const archivoProductos = "Productos.JSON";
const rutaProductos = path.join(__dirname, "../public/data", archivoProductos);
const productManager = new ProductManager(rutaProductos);

router.get('/',(req,res)=>{

    const productos = productManager.getProductos();
  
  res.setHeader('Content-Type','text/html');
  res.status(200).render('home', { productos , 
    titulo:'Home Page',
    estilo:'styles.css' });
  })

  router.get('/realTimeProducts', (req, res) => {
    const productos = productManager.getProductos();
    res.render('realTimeProducts', { productos , 
      titulo:'Home Page',
      estilo:'styles.css' });
  });


router.use("/api/carts", cartRouter);

// Endpoint para obtener productos con límite opcional
router.get("/products", (req, res) => {
  const { limit } = req.query;

  let productos = productManager.getProductos();

  if (limit) {
    const limiteNumerico = parseInt(limit);
    productos = productos.slice(0, limiteNumerico);
  }

  res.json(productos);
});

router.post("/products", (req, res) => {
    const io = require('../app').io;
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;
  const newProduct = {
    title,
    description,
    code,
    price,
    status: true, // Status es true por defecto
    stock,
    category,
    thumbnails,
  };
  try {
    productManager.addProduct(newProduct);
    // Emite un evento para notificar a los clientes de la actualización
    io.emit('updateProducts', productManager.getProductos());
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/products/:pid", (req, res) => {
  const io = require('../app').io;
  const productId = parseInt(req.params.pid);
  try {
    productManager.eliminarProducto(productId);
    // Emite un evento para notificar a los clientes de la actualización
    io.emit('updateProducts', productManager.getProductos());
    res.status(200).json({ message: `Producto con ID ${productId} eliminado exitosamente` });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;

  try {
    productManager.updateProduct(productId, updatedProduct);
    res.status(200).json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;