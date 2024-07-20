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
                article.querySelector('.product').dataset.id = id;
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

    const filterInput = document.getElementById('filterInput');
    filterInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.categoria.toLowerCase().includes(searchTerm)
        );
        ui.displayProducts(filteredProducts);
    });
});
