class ProductManager{
    constructor(){
        this.Products=[]
    }
    addProduct(title, description, price, thumbnail, code, stock){
        
        const productosIguales = this.Products.some(
            product => product.title == title && product.code == code
        );
        
        if (productosIguales) {
            throw new Error(`Error: Existe un producto con el título o código iguales.`);
        }
        
        let nuevoProducto = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        if (this.Products.length===0){
            nuevoProducto.id=1
        }
        else
        nuevoProducto.id=this.Products.length+1

        this.Products.push(nuevoProducto)
    }

    getProducts(){
        return this.Products
    }

    getProductById(id) {
        const product = this.Products.find(product => product.id === id);
        if (!product) {
            throw new Error(`Error: No se encontró ningún producto con el ID ${id}.`);
        }
        return product;
    }

}

let tm = new ProductManager();
console.log(tm.getProducts());

try {
    tm.addProduct('Mouse', 'Logitech', 2300, 'img', 20342, 20);
    tm.addProduct('Teclado', 'Mecanico', 4000, 'img', 53425, 20);
    tm.addProduct('Gabinete', 'Tamaño compatible ATX o menos', 9500, 'img', 32453, 10);
    tm.addProduct('Gabinete', 'Tamaño compatible ATX o menos', 9500, 'img', 32453, 10);
    console.log(tm.getProducts());

    const product = tm.getProductById(2);
    console.log("Producto encontrado:", product);
    
    const nonExistentProduct = tm.getProductById(2); 
} catch (error) {
    console.error(error.message);
}