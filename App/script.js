const fs = require("fs");

let path = "../archivos/Productos.JSON";
class ProductManager {
  constructor(filePath) {
    this.Productos = [];
    this.path = filePath;
  }

  saveProductos() {
    fs.writeFileSync(this.path, JSON.stringify(this.Productos, null, "\t"));
  }

  updateProduct(id, field, value) {
    const productToUpdate = this.Productos.find((product) => product.id === id);
    if (!productToUpdate) {
      console.log(`Error: No se encontró ningún producto con el ID ${id}.`);
      return;
    }
    productToUpdate[field] = value;
    this.saveProductos();
  }

  deleteProduct(id) {
    const indexToDelete = this.Productos.findIndex(
      (product) => product.id === id
    );
    if (indexToDelete === -1) {
      console.log(`Error: No se encontró ningún producto con el ID ${id}.`);
      return;
    }

    this.Productos.splice(indexToDelete, 1);
    this.saveProductos();
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const productosIguales = this.Productos.some(
      (product) => product.title == title && product.code == code
    );

    if (productosIguales) {
      throw new Error(
        `Error: Existe un producto con el título o código iguales.`
      );
    }

    let nuevoProducto = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    if (this.Productos.length === 0) {
      nuevoProducto.id = 1;
    } else nuevoProducto.id = this.Productos[this.Productos.length - 1].id + 1;

    this.Productos.push(nuevoProducto);
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

let tm = new ProductManager(path);
console.log(tm.getProductos());

tm.addProduct("Mouse", "Logitech", 2300, "img", 20342, 20);
tm.addProduct("Teclado", "Mecanico", 4000, "img", 53425, 20);
tm.addProduct(
  "Gabinete",
  "Tamaño compatible ATX o menos",
  9500,
  "img",
  32453,
  10
);
// tm.addProduct('Gabinete', 'Tamaño compatible ATX o menos', 9500, 'img', 32453, 10);
console.log(tm.getProductos());

const product = tm.getProductById(2);

if (product !== undefined) {
  console.log("Producto encontrado:", product);
  fs.writeFileSync(path, JSON.stringify(product, null, "\t"));
}

tm.updateProduct(2, "price", 250);

tm.deleteProduct(1);
