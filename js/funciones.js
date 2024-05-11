//Calcular el costo total de productos servicios seleccionados por el usuario
//Lista de productos para guardar el precio
const productos = [
    { id: 1, nombre: "Cinturon con Mancuernas para Sentadillas", precio: 38},
    { id: 2, nombre: "Botella Softflask para Correr", precio: 45},
    { id: 3, nombre: "Cangurera Deportiva", precio: 12},
    { id: 4, nombre: "Correa Luz Led", precio: 19},
    { id: 5, nombre: "Juguete Saltarín Pequeño", precio: 8},
    { id: 6, nombre: "Bebedero Portátil para Viajes", precio: 22},
    { id: 7, nombre: "Organizador Horizontal de Baño", precio: 28},
    { id: 8, nombre: "Colgador de Llaves en forma de Gato", precio: 34},
    { id: 9, nombre: "Espejo Irregular Mediano Decorativo", precio: 28},
    { id: 10, nombre: "Bronceador Aceite Zanahoria", precio: 42},
    { id: 11, nombre: "Crema Hidratante con Aceites Esenciales", precio: 48},
    { id: 12, nombre: "Autobronceador Olor Chocolate", precio: 42},
];

function mostrarProductos() {  //función con ciclo
    console.log("Listado de productos disponibles:");
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        console.log(producto.id + ". " + producto.nombre + " - $" + producto.precio);
    }
}

function saludar(){
    alert("¡Bienvenid@ a Kanwee! Vamos a calcular el costo total de tu próxima compra🛍️");
}

saludar()


//productos seleccionados por el cliente
let productosSeleccionados = [];

while (true) {  //while para obligarlos a comprar
    mostrarProductos();
    const seleccion = prompt("Ingrese el número del producto que desea agregar (o presione Cancelar para finalizar):");
    
    //salir del bucle
    if (seleccion === null) {
        break;
    }

    const numeroProducto = parseInt(seleccion);

    //condicional
    if (!isNaN(numeroProducto) && numeroProducto >= 1 && numeroProducto <= productos.length) {
        productosSeleccionados.push(numeroProducto);
    } else {
        console.warn("Por favor ingrese un número válido de producto.");
    }
}

function calcularCostoTotal(productosSeleccionados) {
    let costoTotal = 0;
    productosSeleccionados.forEach(id => {
        const producto = productos.find(p => p.id === id);
        if (producto) {
            costoTotal += producto.precio;
        }
    });
    return costoTotal;
}

const costoTotal = calcularCostoTotal(productosSeleccionados);
console.log(`El costo total de los productos seleccionados es: $${costoTotal}`);