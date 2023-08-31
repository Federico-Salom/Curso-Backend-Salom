const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.Productos = [];
    this.path = filePath;
    this.loadProductos();
  }

  loadProductos() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.Productos = JSON.parse(data);
    } catch (error) {
      this.Productos = [];
    }
  }

  saveProductos() {
    fs.writeFileSync(this.path, JSON.stringify(this.Productos, null, "\t"));
  }

  updateProduct(id, updatedProduct) {
    const indexToUpdate = this.Productos.findIndex(
      (product) => product.id === id
    );
    if (indexToUpdate === -1) {
      throw new Error(`No se encontró ningún producto con el ID ${id}`);
    }

    this.Productos[indexToUpdate] = {
      ...this.Productos[indexToUpdate],
      ...updatedProduct,
      id, // Mantener el mismo ID
    };

    this.saveProductos();
  }

  eliminarProducto(id) {
    const indexToDelete = this.Productos.findIndex(
      (product) => product.id === id
    );
    if (indexToDelete === -1) {
      throw new Error(`Error: No se encontró ningún producto con el ID ${id}.`);
    }

    this.Productos.splice(indexToDelete, 1);
    this.saveProductos();
  }

  addProduct(product) {
    const productosIguales = this.Productos.some(
      (existingProduct) =>
        existingProduct.title === product.title ||
        existingProduct.code === product.code
    );

    if (productosIguales) {
      throw new Error(
        "Error: Existe un producto con el título o código iguales."
      );
    }

    const newProduct = {
      ...product,
      id:
        this.Productos.length === 0
          ? 1
          : this.Productos[this.Productos.length - 1].id + 1,
    };

    this.Productos.push(newProduct);
    this.saveProductos();
  }

  getProductos() {
    return this.Productos;
  }

  getProductById(id) {
    const product = this.Productos.find((product) => product.id === id);
    if (!product) {
      throw new Error(`Error: No se encontró ningún producto con el ID ${id}.`);
    }
    return product;
  }
}

module.exports = ProductManager;
