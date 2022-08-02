//DECLARACIÓN DE VARIABLES GLOBALES
let productosDisponibles;

let listado = document.getElementById('listado')
const carritoContenedor = document.getElementById('carrito-contenedor')

const vaciarCarrito = document.getElementById('vaciar-carrito')

const precioTotal = document.getElementById('precioTotal')
const contadorCarrito = document.getElementById ('contadorCarrito')

const finalizarCompra = document.getElementById('finalizar-compra');

let carrito = []

cargarProductos()

//QUE PESE A REFRESCAR QUEDE EL CARRITO INTACTO

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})


//CREACIÓN DE CARDS QUE PROVIENEN DE UN JSON Y SE INYECTAN EN EL INDEXHTML
function cargarProductos(){
    fetch ('datos/datos.json')

    .then(function(resp) {
        return resp.json()
    })

    .then(function(data){
        productosDisponibles = data
        data.forEach ((producto) => {
            const div = document.createElement('div')
            div.classList.add('producto')
            div.innerHTML = `
            <img src=${producto.imagen} alt= "">
            <h3>${producto.modelo}</h3>
            <p class="precioProducto">Precio:$ ${producto.precio}</p>
            <button id="agregar${producto.id}" class="boton-agregar btn btn-primary">Agregar</button>
            `
            listado.appendChild(div)
            
           const boton = document.getElementById(`agregar${producto.id}`)
        
            boton.addEventListener('click', () =>{
            agregarAlCarrito(producto.id)
            Toastify({
                text: "Agregado al carrito!",
                duration: 3000,
                style: {
                background: "linear-gradient(to right, #BCA5FF, #FF0000)",
                }
                }).showToast();
        })
       
            
        })
        
    })

}



//Tratar de comenzar a agregar los productos al carrito cuando selecciono el botón "agregar"

const agregarAlCarrito = (prodId) => {
    const existe = carrito.some (prod => prod.id === prodId)

    if (existe){ 
        const prod = carrito.map (prod => { 
            
            if (prod.id === prodId){
                prod.cantidad += 1 
            }
        })
        
    } 
    else { 
        const item = productosDisponibles.find((prod) => prod.id === prodId)
        carrito.push(item)
    }

actualizarCarrito()
}

 //Lo que va a contener el carrito de compras, es decir, lo que irá dentro del modal, los productos seleccionados.


const actualizarCarrito = () => {
    contadorCarrito.innerText = [...carrito].reduce(
        (acc, el) => acc + el.cantidad,
        0
    );
    carritoContenedor.innerHTML=""

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className= ('productoEnCarrito')
        div.innerHTML=`
        
        <p> Modelo: ${prod.modelo}</p>
        
        <p> Precio: ${prod.precio}</p>

        <p> Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
       
        <button onclick="eliminarProducto(${prod.id})"class="boton-eliminar">X</button>
      
        `
        carritoContenedor.appendChild(div)

        localStorage.setItem('carrito', JSON.stringify(carrito))
        
        
    })

    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)

}



//ELIMINAR PRODUCTOS


const eliminarProducto = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)
    const indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    actualizarCarrito()
    Toastify({
        text: "¡Tu producto fue eliminado!",
        duration: 3000,
        style: {
        background: "linear-gradient(to right, #BB8FCE, #7FB3D5)",
        }
        }).showToast();
        actualizarCarrito();
        localStorage.setItem("carrito", JSON.stringify(carrito));
    
}

//VACIAR CARRITO COMPLETO

vaciarCarrito.addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito()
    Toastify({
        text: "¡Tu carrito está vacio!",
        duration: 3000,
        style: {
        background: "linear-gradient(to right, #85C1E9, #148F77)",
        }
        }).showToast();
        actualizarCarrito();
        localStorage.setItem("carrito", JSON.stringify(carrito));

})

//FINALIZAR COMPRA


finalizarCompra.addEventListener('click', () => {
    Swal.fire({
        title: '¿Está seguro/a que desea finalizar la compra?',
        icon: 'success',
        confirmButtonText: 'Sí, seguro',
        showCancelButton: 'No, no quiero',
}).then((result) => {

    if (result.isConfirmed) {
        dejarEnCero ()
        actualizarCarrito()
        Swal.fire({
            title: 'Gracias por su compra',
            icon: 'success',
            text: 'Su pedido fué realizado con éxito'
        })
    }
})

})

//Dejar carrito en cero una vez realizada la compra

function dejarEnCero() {
    carrito.length = 0
}




//MODAL DEL CARRITO//


const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
const botonAbrir = document.getElementById('boton-carrito')
const botonCerrar = document.getElementById('carritoCerrar')
const modalCarrito = document.getElementsByClassName('modal-carrito')[0]


botonAbrir.addEventListener('click', () => {
    contenedorModal.classList.toggle('modal-active')
});

botonCerrar.addEventListener('click', () => {
    contenedorModal.classList.toggle('modal-active')
});

contenedorModal.addEventListener('click', (event) => {
    botonCerrar ()
});

modalCarrito.addEventListener('click', (event) => {
    event.stopPropagation();
});
