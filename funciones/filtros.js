/*
const productTemplate = document.getElementById('product-template');
let categoryFilterAll = document.querySelector('.btn-all');
let categoryFilterAccesorios = document.querySelector('.btn-accesorios');
let categoryFilterRopa = document.querySelector('.btn-ropa');
let categoryFilterCuidadoPersonal = document.querySelector('.btn-cuidado_personal');
let categoryFilterTendencias = document.querySelector('.btn-tendencias');

class Products {
    async getProducts() {
        try {
            const response = await fetch('./productos/productos.json');
            const data = await response.json();
            let products = data.items;
            products = products.map(item => {
                const { name: title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                const article = productTemplate.content.cloneNode(true).children[0];
                return { title, price, id, image, element: article };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}


class UI {
    displayProductsIndex(products) {
        let result = '';
        let iteratorVariable = 0;
        products.forEach(product => { 
            if (iteratorVariable < 3){
                result +=`            
                <article class="product">
                    <div class="img-container">
                        <img src=${product.image} alt="product" class="product-img"/>
                        <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>
                        add to cart
                        </button>
                    </div>
                    <div class="product-footer">
                        <h3>${product.title}</h3>
                        <h4>$${product.price}</h4>
                    </div>
                </article>
                <!-- end of single product-->`;
                iteratorVariable++;
            }
        });
        productsDOMIndex.innerHTML = result;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = new Products();
    const productList = await products.getProducts();
    
    productList.forEach(product => {
        product.element.querySelector('.product-image').src = product.image;
        product.element.querySelector('.product-title').textContent = product.title;
        product.element.querySelector('.product-price').textContent = product.price;
        document.getElementById('products').appendChild(product.element);
    });
});

*/

const productTemplate = document.getElementById('product-template');

class Products {
    async getProducts() {
        try {
            const response = await fetch('./productos/productos.json');
            const data = await response.json();
            let products = data.items;
            products = products.map(item => {
                const { name: title, price, categoria } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                const article = productTemplate.content.cloneNode(true).children[0];
                article.querySelector('.product-image').src = image;
                article.querySelector('.product-title').textContent = title;
                article.querySelector('.product-price').textContent = price;
                return { title, price, id, image, categoria, element: article };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

class UI {
    displayProducts(products) {
        const productsDOM = document.getElementById('products-list');
        productsDOM.innerHTML = '';
        products.forEach(product => {
            productsDOM.appendChild(product.element);
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const productsInstance = new Products();
    const ui = new UI();
    const products = await productsInstance.getProducts();

    // Mostrar todos los productos inicialmente
    ui.displayProducts(products);

    function filterProductsByCategory(e) {
        const category = e.target.className.split(' ')[1].replace('btn-', '').replace('_', ' ');
        if (category === 'all') {
            ui.displayProducts(products);
        } else {
            const filteredProducts = products.filter(product => 
                product.categoria.toLowerCase() === category
            );
            ui.displayProducts(filteredProducts);
        }
    }

    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', filterProductsByCategory);
    });
});
