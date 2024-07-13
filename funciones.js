/*const client = contentful.createClient({
    space: 'u7r20k5jit83',
    accessToken: 'NycafKU1CF37YyJ2j9gPOs0Ll9Litljh6Ow3yzOBRec'
})*/

const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const checkOutBtn = document.querySelector('.check-out-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const loginFormDOM = document.querySelector('.main');
const loginFormOverlay = document.querySelector('.login-form-container');
const closeLoginFormBtn = document.querySelector('.close-login-form');
const cartItems = document.querySelector('.cart-items');
const cartTotal= document.querySelector('.cart-total');
const cartContent= document.querySelector('.cart-content');
const productsDOM= document.querySelector('.products-center');
const productsDOMIndex= document.querySelector('.products-center-index');
//const productTemplate= document.querySelector('[product-template]')
const productTemplate = document.getElementById('product-template');
let searchInput = document.querySelector('[data-search]');
let companyFilterAll = document.querySelector('.btn-all');
let companyFilterChangas = document.querySelector('.btn-changas');
let companyFilterVans = document.querySelector('.btn-vans');
let companyFilterRandom = document.querySelector('.btn-random');
let companyFilterPuma = document.querySelector('.btn-puma');
const priceInput = document.querySelector('.price-filter');
const priceValue = document.querySelector('.price-value');
const newsletterBtn = document.querySelector('.newsletter-btn');
const newsletterMailInput = document.querySelector('.newsletter-mail-input');

checkOutBtn.disabled = true;
checkOutBtn.classList.add('disabled');

let cart = [];
let buttonsDOM = [];

class Products {
    async getProducts() {
        try {
            const response = await fetch('productos.json');
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

/*
class Products{
    async getProducts(){
        try{
            const contentful = await client.getEntries({content_type:'changasProducts'});
            let products = contentful.items;
                products = products.map(item=>{
                    const{title,price} = item.fields;
                    const {id} = item.sys;
                    const image = item.fields.image.fields.file.url;
                    const article = productTemplate.content.cloneNode(true).children[0];
                    return {title, price, id, image, element: article};
                })
            return products;
        } 
            catch (error){
            console.log(error);
            }   
    }
}
*/

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
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            } 
            button.addEventListener("click", event => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                let cartItem = {...Storage.getProduct(id), amount:1};
                cart = [...cart, cartItem];
                Storage.saveCart(cart);
                this.setCartValues(cart);
                this.addCartItem(cartItem);
                this.showCart();
            })
        })
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat (tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product"/>
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
        if (cartItems.innerText == 0){
            checkOutBtn.disabled = true;
            checkOutBtn.classList.add('disabled');
        }
        else{
            checkOutBtn.disabled = false;
            checkOutBtn.classList.remove('disabled');
        }
    }
    showLoginForm(){
        loginFormOverlay.classList.add('transparentBcgLoginFormContainer');
        loginFormDOM.classList.add('showLoginForm');
    }
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
        closeLoginFormBtn.addEventListener('click', this.hideLoginForm);
    }
    populateCart (cart){
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    hideLoginForm(){
        loginFormOverlay.classList.remove('transparentBcgLoginFormContainer');
        loginFormDOM.classList.remove('showLoginForm');
    }
    cartLogic(){ 
        clearCartBtn.addEventListener('click', () =>{
            this.clearCart();
        });
        checkOutBtn.addEventListener('click', () =>{
            this.hideCart();
            this.showLoginForm();
        });
        cartContent.addEventListener('click', event =>{
            if (event.target.classList.contains("remove-item")){
                try{
                    let removeItem = event.target;
                    let id = removeItem.dataset.id;
                    cartContent.removeChild(removeItem.parentElement.parentElement);
                    this.removeItem(id);
                    if (cartItems.innerText == 0){
                        checkOutBtn.disabled = true;
                        checkOutBtn.classList.add('disabled');
                    }
                    else{
                        checkOutBtn.disabled = false;
                        checkOutBtn.classList.remove('disabled');
                    }
                }
                catch(error){
                    console.log(error);
                }
                
            } else if (event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id); // acá se podría crear un método que busque en el carrito x id
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("fa-chevron-down")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id); // acá se podría crear un método que busque en el carrito x id
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
                if (cartItems.innerText == 0){
                    checkOutBtn.disabled = true;
                    checkOutBtn.classList.add('disabled');
                }
                else{
                    checkOutBtn.disabled = false;
                    checkOutBtn.classList.remove('disabled');
                }
            }
        })
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        };
        this.hideCart();
    }
    removeItem(id){
        try{
            cart = cart.filter(item => item.id !==id);
            this.setCartValues(cart);
            Storage.saveCart(cart);
            let button = this.getSingleButton(id);
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
        }
        catch (error){
            console.log(error);
        }
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

/*
document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI ()
    const products = new Products();
    ui.setupAPP();
    products.getProducts().then(products => {
        ui.displayProductsIndex(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        ui.cartLogic();
    });
});
*/

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

//login form
/*var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function validate(){
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
if(username.length > 0 && password.length > 0){
    if ( username == "changas" && password == "changas"){
        Swal.fire(
            'Good job!',
            'Login succesfully!',
            'success'
        ).then((result)=>{
            if(result.isConfirmed){
                window.location = "./index.html";
            }
        })
        return false;
    }
    else{
    attempt --;// Decrementing by one.
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have '+attempt+ ' attempt left',
    })
    // Disabling fields after 3 attempts.
    if( attempt == 0){
    document.getElementById("username").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("submit").disabled = true;
    window.location = "./index.html"; // Redirecting to other page.
    return false;
    }
    }
}
else{
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'user/password is missing',   
    })
};
}*/

//Menú hamburguesa
/*const toggleNav = document.querySelector('.toggle-nav');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const closeBtn = document.querySelector('.sidebar-close');

toggleNav.addEventListener('click', () => {
    sidebarOverlay.classList.add('show');
});
closeBtn.addEventListener('click', () => {
    sidebarOverlay.classList.remove('show');
});*/

//toastify newsletter confirmation
newsletterMailInput.value = ''
newsletterBtn.addEventListener('click',() =>{
    let e = newsletterMailInput.value;
    ValidateEmail(e);
    newsletterMailInput.value = '';
});
//función que valida el mail
function ValidateEmail(inputText){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat)){
        Toastify({
            text: "👍🏼Well done!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
        }).showToast();
        document.form1.text1.focus();
        return true;
    }
    else{
        Toastify({
            text: '🤦🏽‍♂️You have entered an invalid email address!',
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "#ff0000",
            },
        }).showToast();
        document.form1.text1.focus();
        return false;
    }
}