// AHORA TODO ESTÁ DENTRO DE runApp()
function runApp() {
  // === ▼▼ INICIO LÓGICA POPUP (PROMOCIONAL) ▼▼ ===
  const overlay = document.getElementById("popup-overlay");
  const modal = document.getElementById("popup-modal");
  const closeBtn = document.getElementById("popup-close");
  const wppBtn = document.getElementById("popup-wpp-btn");

  function cerrarPopup() {
    if (overlay && modal) {
      overlay.style.display = "none";
      modal.style.display = "none";
      localStorage.setItem("raza_popup_visto", "true");
    }
  }

  function mostrarPopup() {
    if (overlay && modal) {
      overlay.style.display = "block";
      modal.style.display = "block";
    }
  }

  if (localStorage.getItem("raza_popup_visto") !== "true") {
    setTimeout(mostrarPopup, 2000);
  }

  if (closeBtn) closeBtn.addEventListener("click", cerrarPopup);
  if (overlay) overlay.addEventListener("click", cerrarPopup);
  if (wppBtn) wppBtn.addEventListener("click", cerrarPopup);
  // === ▲▲ FIN LÓGICA POPUP ▲▲ ===
  
  // === CARRITO DE COMPRAS ===
  const cartIconButton = document.getElementById("cart-icon-button");
  const cartCountElement = document.getElementById("cart-count");
  const miniCartContainer = document.getElementById("mini-cart");
  const miniCartItemsContainer = document.getElementById("mini-cart-items");
  const closeCartButton = document.getElementById("close-cart-button");
  const hacerPedidoButton = document.getElementById("btn-hacer-pedido");
  const burgerButton = document.getElementById("burger-button");
  const navContainer = document.getElementById("main-nav-container");

  let carrito = JSON.parse(localStorage.getItem("carrito_raza")) || [];

  actualizarContadorCarrito();
  renderizarItemsCarrito();

  // Lógica añadir con cantidad
  const addWithQtyButtons = document.querySelectorAll(".btn-add-with-qty");
  addWithQtyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.closest(".add-with-qty-view");
      const quantityInput = view.querySelector(".quantity-input");
      let cantidad = parseInt(quantityInput.value);
      const nombreProducto = button.dataset.nombre;
      const minCantidad = parseInt(quantityInput.min) || 1;
      const maxStock = parseInt(quantityInput.max) || 9999;

      if (isNaN(cantidad)) {
        alert("Por favor, ingresá un número válido.");
        resaltarError(quantityInput);
        return;
      }
      if (cantidad < minCantidad) {
        alert(`⚠️ El pedido mínimo es de ${minCantidad} unidades.`);
        quantityInput.value = minCantidad;
        resaltarError(quantityInput);
        return;
      }
      if (cantidad > maxStock) {
        alert(`📦 Stock Insuficiente. Máximo: ${maxStock}.`);
        quantityInput.value = maxStock;
        resaltarError(quantityInput);
        return;
      }

      const producto = {
        id: Date.now(),
        nombre: nombreProducto,
        precio: parseFloat(button.dataset.precio) || 0,
        cantidad: cantidad,
      };

      agregarAlCarrito(producto);
      notificarAgregado(button);
    });
  });

  function resaltarError(input) {
    input.style.border = "2px solid var(--color-acento-raza)";
    input.style.backgroundColor = "#ffe6e6";
    setTimeout(() => {
      input.style.border = "";
      input.style.backgroundColor = "white";
    }, 2000);
  }

  function notificarAgregado(btn) {
    const textoOriginal = btn.innerText;
    btn.innerText = "¡Agregado! ✓";
    btn.style.backgroundColor = "#2ecc71";
    btn.disabled = true;
    setTimeout(() => {
      btn.innerText = textoOriginal;
      btn.style.backgroundColor = "";
      btn.disabled = false;
    }, 1500);
  }

  // Lógica añadir directo
  const directAddButtons = document.querySelectorAll(".add-to-cart-direct");
  directAddButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const producto = {
        id: Date.now(),
        nombre: button.dataset.nombre,
        precio: parseFloat(button.dataset.precio),
        cantidad: parseInt(button.dataset.cantidad) || 1,
      };
      agregarAlCarrito(producto);
    });
  });

  if (cartIconButton) {
    cartIconButton.addEventListener("click", () => {
      miniCartContainer.classList.toggle("visible");
    });
  }
  if (closeCartButton) {
    closeCartButton.addEventListener("click", () => {
      miniCartContainer.classList.remove("visible");
    });
  }
  if (hacerPedidoButton) {
    hacerPedidoButton.addEventListener("click", enviarPedidoWhatsApp);
  }
  if (burgerButton && navContainer) {
    burgerButton.addEventListener("click", () => {
      navContainer.classList.toggle("nav-active");
      burgerButton.classList.toggle("burger-active");
    });
  }

  function agregarAlCarrito(producto) {
    carrito.push(producto);
    guardarCarritoEnStorage();
    actualizarContadorCarrito();
    renderizarItemsCarrito();
    if (!miniCartContainer.classList.contains("visible")) {
      miniCartContainer.classList.add("visible");
    }
  }

  function renderizarItemsCarrito() {
    miniCartItemsContainer.innerHTML = "";
    if (carrito.length === 0) {
      miniCartItemsContainer.innerHTML = '<p style="padding: 10px; text-align: center;">Tu carrito está vacío.</p>';
      return;
    }
    carrito.forEach((producto) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("mini-cart-item");
      itemElement.innerHTML = `
                <span>${producto.nombre} (${producto.cantidad})</span>
                <span class="remove-item" data-id="${producto.id}">❌</span>
            `;
      miniCartItemsContainer.appendChild(itemElement);
    });
    asignarEventosEliminar();
  }

  function asignarEventosEliminar() {
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productoId = parseInt(button.dataset.id);
        eliminarDelCarrito(productoId);
      });
    });
  }

  function enviarPedidoWhatsApp() {
    const miTelefono = "5492491234567";
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    let mensaje = "¡Hola RAZA! 🏁 Quisiera cotizar el siguiente pedido:\n\n";
    carrito.forEach((producto) => {
      mensaje += `* ${producto.nombre} (Cant: ${producto.cantidad})\n`;
    });
    mensaje += `\n¡Aguardo su contacto para coordinar!`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${miTelefono}?text=${mensajeCodificado}`, "_blank");
    vaciarCarrito();
  }

  function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnStorage();
    actualizarContadorCarrito();
    renderizarItemsCarrito();
    miniCartContainer.classList.remove("visible");
  }

  function eliminarDelCarrito(productoId) {
    carrito = carrito.filter((producto) => producto.id !== productoId);
    guardarCarritoEnStorage();
    actualizarContadorCarrito();
    renderizarItemsCarrito();
  }

  function actualizarContadorCarrito() {
    if (cartCountElement) cartCountElement.textContent = carrito.length;
  }

  function guardarCarritoEnStorage() {
    localStorage.setItem("carrito_raza", JSON.stringify(carrito));
  }

  // === GUÍA DE TALLES (GENERAL) ===
  const modalTallesGeneral = document.getElementById("modal-talles");
  const btnCerrarTallesGeneral = document.querySelector(".close-talles");

  document.querySelectorAll(".trigger-talles").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (modalTallesGeneral) modalTallesGeneral.style.display = "block";
    });
  });

  if (btnCerrarTallesGeneral) {
    btnCerrarTallesGeneral.addEventListener("click", () => {
      modalTallesGeneral.style.display = "none";
    });
  }

  // === ▼▼ LÓGICA MODAL ESPECÍFICO (GUANTES) ▼▼ ===
  window.openModal = function() {
    const modal = document.getElementById("tallesModal");
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  };

  window.closeModal = function() {
    const modal = document.getElementById("tallesModal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  // Cierre unificado para todos los modales al hacer clic fuera
  window.addEventListener("click", (event) => {
    const modalG = document.getElementById("modal-talles");
    const modalE = document.getElementById("tallesModal");
    
    if (event.target == modalG) modalG.style.display = "none";
    if (event.target == modalE) window.closeModal();
  });

  window.openTab = function (tabName) {
    document.querySelectorAll(".tab-content").forEach((el) => el.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach((el) => el.classList.remove("active"));
    document.getElementById(tabName).classList.add("active");
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      if (btn.textContent.toLowerCase().includes(tabName.substring(0, 4))) {
        btn.classList.add("active");
      }
    });
  };

  // === LÓGICA DE CARRUSELES ===
  const allSliders = document.querySelectorAll(".slider-container");
  allSliders.forEach((sliderContainer) => {
    const track = sliderContainer.querySelector(".slider-track");
    const slides = Array.from(track.querySelectorAll(".slide"));
    const nextBtn = sliderContainer.querySelector(".slider-btn.next");
    const prevBtn = sliderContainer.querySelector(".slider-btn.prev");
    const dotsContainer = sliderContainer.querySelector(".slider-dots");

    if (slides.length <= 1) return;

    let currentSlide = 0;
    let autoPlayInterval;
    const autoPlayDelay = 4000;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("slider-dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
             goToSlide(index);
             resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".slider-dot")) : [];

    function goToSlide(slideIndex) {
      if (slideIndex < 0) slideIndex = slides.length - 1;
      else if (slideIndex >= slides.length) slideIndex = 0;
      if (track) track.style.transform = `translateX(-${slideIndex * 100}%)`;
      if (dots.length > 0) {
        dots.forEach((dot) => dot.classList.remove("active"));
        dots[slideIndex].classList.add("active");
      }
      currentSlide = slideIndex;
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, autoPlayDelay);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    if (nextBtn) nextBtn.addEventListener("click", () => { goToSlide(currentSlide + 1); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { goToSlide(currentSlide - 1); resetAutoPlay(); });

    startAutoPlay();
  });

  // === SELECCIÓN DE VARIANTE (GUANTES) ===
  window.selectVariant = function(variantElement, name, price) {
    const section = variantElement.closest('.gloves-line-section');
    const allOptions = section.querySelectorAll('.variant-option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    variantElement.classList.add('selected');

    const buyButton = section.querySelector('.add-to-cart-direct');
    if(buyButton) {
        buyButton.dataset.nombre = name;
        buyButton.dataset.precio = price;
        const originalText = "AÑADIR AL CARRITO";
        buyButton.innerText = "SELECCIONADO: " + name;
        setTimeout(() => { buyButton.innerText = originalText; }, 1000);
    }
  };

} // FIN RUNAPP