const express = require("express");
const path = require("path");
const ProductManager = require("./productManager");
const cartRouter = require("./cartRoutes"); // Importa el enrutador de carritos

const app = express();
const port = 8080;

const archivoProductos = "Productos.JSON";
const rutaProductos = path.join(__dirname, "../archivos", archivoProductos);

const productManager = new ProductManager(rutaProductos);

app.use(express.json());

// Configura el enrutador de carritos
app.use("/api/carts", cartRouter);

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

app.post("/", (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
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
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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

app.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    productManager.eliminarProducto(productId);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.put("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;

  try {
    productManager.updateProduct(productId, updatedProduct);
    res.status(200).json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
