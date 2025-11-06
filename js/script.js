/**

 * -----------------------------------------------------------------

 * SCRIPT DEL CARRITO DE COMPRAS LOCAL (RAZA)

 * -----------------------------------------------------------------

 */



document.addEventListener('DOMContentLoaded', () => {



    // 1. DEFINICIÓN DE CONSTANTES

    const cartIconButton = document.getElementById('cart-icon-button');

    const cartCountElement = document.getElementById('cart-count');

    const addToCartButtons = document.querySelectorAll('.add-to-cart');

   

    // Nuevas constantes para el panel

    const miniCartContainer = document.getElementById('mini-cart');

    const miniCartItemsContainer = document.getElementById('mini-cart-items');



    // == NUEVA CONSTANTE ==

    const hacerPedidoButton = document.getElementById('btn-hacer-pedido');



    // === ▼▼ NUEVAS CONSTANTES PARA EL MENÚ ▼▼ ===

    const burgerButton = document.getElementById('burger-button');

    // Ahora apuntamos al CONTENEDOR <nav> en lugar de al <ul>

    const navContainer = document.getElementById('main-nav-container');

   

    // 2. INICIALIZACIÓN DEL CARRITO

    let carrito = JSON.parse(localStorage.getItem('carrito_raza')) || [];

   

    actualizarContadorCarrito();

    // Renderiza el carrito al cargar la página (por si ya había items)

    renderizarItemsCarrito();



    // 3. ASIGNAR EVENTOS

   

    // Clic en los botones "Añadir al Carrito"

    addToCartButtons.forEach(button => {

        button.addEventListener('click', () => {

            const producto = {

                // Usamos Date.now() como un ID simple para poder borrarlo

                id: Date.now(),

                nombre: button.dataset.nombre,

                precio: parseFloat(button.dataset.precio),

                cantidad: 1

            };

            agregarAlCarrito(producto);

        });

    });



    // Clic en el ÍCONO del carrito (para mostrar/ocultar)

    cartIconButton.addEventListener('click', () => {

        miniCartContainer.classList.toggle('visible');

    });



    // == NUEVO EVENT LISTENER ==

    hacerPedidoButton.addEventListener('click', enviarPedidoWhatsApp);



    // === ▼▼ NUEVO EVENT LISTENER PARA EL MENÚ ▼▼ ===

    // (Solo se activa si el botón y el nav existen)

    if (burgerButton && navContainer) { // <-- Cambio aquí

        burgerButton.addEventListener('click', () => {

           

            // Ahora activamos el CONTENEDOR, no solo la lista

            navContainer.classList.toggle('nav-active'); // <-- Cambio aquí

           

            // También animamos el botón (CSS 'burger-active')

            burgerButton.classList.toggle('burger-active');

        });

    }



    // 4. FUNCIONES PRINCIPALES



    function agregarAlCarrito(producto) {

        carrito.push(producto);

        console.log('Carrito actualizado:', carrito);

        guardarCarritoEnStorage();

        actualizarContadorCarrito();

        renderizarItemsCarrito(); // Vuelve a dibujar el carrito

       

        // Muestra el carrito si no está visible

        if (!miniCartContainer.classList.contains('visible')) {

            miniCartContainer.classList.add('visible');

        }

    }



    /**

     * Dibuja los items del array 'carrito' en el HTML del panel.

     */

    function renderizarItemsCarrito() {

        // Limpia el contenido anterior

        miniCartItemsContainer.innerHTML = '';



        if (carrito.length === 0) {

            miniCartItemsContainer.innerHTML = '<p style="padding: 10px; text-align: center;">Tu carrito está vacío.</p>';

            return;

        }



        carrito.forEach(producto => {

            const itemElement = document.createElement('div');

            itemElement.classList.add('mini-cart-item');

           

            itemElement.innerHTML = `

                <span>${producto.nombre} (${producto.cantidad})</span>

                <span>$${producto.precio.toFixed(0)}</span>

                <span class="remove-item" data-id="${producto.id}">❌</span>

            `;

           

            miniCartItemsContainer.appendChild(itemElement);

        });



        // Añade el evento de clic a los nuevos botones de eliminar

        asignarEventosEliminar();

    }



    /**

     * Asigna la función de eliminar a todos los botones ❌

     */

    function asignarEventosEliminar() {

        const removeButtons = document.querySelectorAll('.remove-item');

        removeButtons.forEach(button => {

            button.addEventListener('click', () => {

                // Obtenemos el ID del producto desde el atributo data-id

                const productoId = parseInt(button.dataset.id);

                eliminarDelCarrito(productoId);

            });

        });

    }



    /**

     * ==========================================================

     * NUEVA FUNCIÓN: Envía el pedido a WhatsApp

     * ==========================================================

     */

    function enviarPedidoWhatsApp() {

        // !! CAMBIA ESTE NÚMERO !!

        // Formato internacional sin +, 00, ni espacios. (Ej. 549 para Argentina Celular)

        const miTelefono = '5492491234567'; // <--- PON TU NÚMERO AQUÍ



        if (carrito.length === 0) {

            alert("Tu carrito está vacío. Añade productos antes de hacer un pedido.");

            return; // No hace nada si el carrito está vacío

        }



        // 1. Crear el mensaje de texto

        let mensaje = "¡Hola RAZA! 🏁 Quisiera cotizar el siguiente pedido:\n\n";

        let total = 0;



        carrito.forEach(producto => {

            mensaje += `* ${producto.nombre} (Cant: ${producto.cantidad})\n`;

            total += producto.precio * producto.cantidad;

        });



        mensaje += `\n*Total (a confirmar): $${total.toFixed(0)}*`;

        mensaje += `\n\n¡Aguardo su contacto para coordinar!`;



        // 2. Codificar el mensaje para la URL

        // Reemplaza espacios con %20, saltos de línea con %0A, etc.

        const mensajeCodificado = encodeURIComponent(mensaje);



        // 3. Crear la URL final

        const urlWhatsApp = `https://wa.me/${miTelefono}?text=${mensajeCodificado}`;



        // 4. Abrir WhatsApp en una nueva pestaña

        window.open(urlWhatsApp, '_blank');



        // 5. (Opcional) Vaciar el carrito después de enviar

        vaciarCarrito();

    }



    /**

     * NUEVA FUNCIÓN: Helper para vaciar el carrito

     */

    function vaciarCarrito() {

        carrito = []; // Vacía el array

        guardarCarritoEnStorage(); // Guarda el array vacío

        actualizarContadorCarrito(); // Actualiza el '0'

        renderizarItemsCarrito(); // Limpia la lista del panel

       

        // Cierra el panel del carrito

        miniCartContainer.classList.remove('visible');

    }

    /**

     * Elimina un producto del array 'carrito' usando su ID.

     * @param {number} productoId - El ID (timestamp) del producto a eliminar.

     */

    function eliminarDelCarrito(productoId) {

        // Filtramos el carrito, dejando solo los items que NO tengan ese ID

        carrito = carrito.filter(producto => producto.id !== productoId);

       

        guardarCarritoEnStorage();

        actualizarContadorCarrito();

        renderizarItemsCarrito(); // Vuelve a dibujar

    }



    function actualizarContadorCarrito() {

        cartCountElement.textContent = carrito.length;

    }



    function guardarCarritoEnStorage() {

        localStorage.setItem('carrito_raza', JSON.stringify(carrito));

    }



}); // Fin del 'DOMContentLoaded'