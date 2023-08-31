const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const archivoCarritos = "carrito.JSON";
const rutaCarritos = path.join(__dirname, "../archivos", archivoCarritos);

router.use(express.json());

// Ruta para crear un nuevo carrito
router.post("/", (req, res) => {
  const newCart = {
    id: Math.random().toString(36).substr(2, 9), // Genera un ID aleatorio
    products: [],
  };

  try {
    const data = fs.readFileSync(rutaCarritos, "utf8");
    const carritos = JSON.parse(data);
    carritos.push(newCart);
    fs.writeFileSync(rutaCarritos, JSON.stringify(carritos, null, "\t"));
    res.status(201).json({ message: "Carrito creado correctamente", cart: newCart });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Ruta para obtener los productos de un carrito
router.get("/:cid", (req, res) => {
  const carritoId = req.params.cid;

  try {
    const data = fs.readFileSync(rutaCarritos, "utf8");
    const carritos = JSON.parse(data);
    const carrito = carritos.find((cart) => cart.id === carritoId);

    if (!carrito) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }

    res.status(200).json(carrito.products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});

// Ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", (req, res) => {
  const carritoId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    const data = fs.readFileSync(rutaCarritos, "utf8");
    const carritos = JSON.parse(data);
    const carrito = carritos.find((cart) => cart.id === carritoId);

    if (!carrito) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }

    const existingProduct = carrito.products.find((product) => product.product === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      carrito.products.push({ product: productId, quantity });
    }

    fs.writeFileSync(rutaCarritos, JSON.stringify(carritos, null, "\t"));
    res.status(201).json({ message: "Producto agregado al carrito correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

module.exports = router;
