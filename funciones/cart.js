class Cart {
    constructor() {
        this.cart = this.getCart();
    }

    getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addToCart(product) {
        Toastify({
            text: "El artículo se agregó al carrito",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "bottom", 
            position: "right", 
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} 
          }).showToast();
        const existingProduct = this.cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            this.cart.push(product);
        }
        this.saveCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(product => product.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const product = this.cart.find(item => item.id === productId);
        if (product) {
            product.quantity = quantity;
            if (product.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
        }
    }

    getTotalItems() {
        return this.cart.reduce((total, product) => total + product.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, product) => total + product.price * product.quantity, 0);
    }

    renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items-container');
        cartItemsContainer.innerHTML = '';
        this.cart.forEach(product => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-title">${product.title}</div>
                <div class="cart-item-quantity">
                    <button class="btn btn-sm btn-outline-info decrease-quantity" data-id="${product.id}">-</button>
                    ${product.quantity}
                    <button class="btn btn-sm btn-outline-info increase-quantity" data-id="${product.id}">+</button>
                </div>
                <div class="cart-item-price">${product.price}</div>
                <button class="btn btn-sm btn-outline-danger remove-item" data-id="${product.id}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cart = new Cart();

    const updateCartBadge = () => {
        const cartBadge = document.querySelector('.cart-items');
        cartBadge.textContent = cart.getTotalItems();
    };

    document.querySelector('#products-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productElement = e.target.closest('.product');
            const product = {
                id: parseInt(productElement.dataset.id, 10),
                title: productElement.querySelector('.product-title').textContent,
                price: parseFloat(productElement.querySelector('.product-price').textContent.replace('$', '')),
                image: productElement.querySelector('.product-image').src
            };
            cart.addToCart(product);
            updateCartBadge();
            cart.renderCart();
        }
    });

    document.querySelector('.cart-items-container').addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id, 10);
        if (e.target.classList.contains('remove-item')) {
            cart.removeFromCart(productId);
            updateCartBadge();
            cart.renderCart();
        } else if (e.target.classList.contains('decrease-quantity')) {
            cart.updateQuantity(productId, cart.cart.find(item => item.id === productId).quantity - 1);
            updateCartBadge();
            cart.renderCart();
        } else if (e.target.classList.contains('increase-quantity')) {
            cart.updateQuantity(productId, cart.cart.find(item => item.id === productId).quantity + 1);
            updateCartBadge();
            cart.renderCart();
        }
    });

    updateCartBadge();
    cart.renderCart();
});
