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
            (product) => product.title === title && product.code === code
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
