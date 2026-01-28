document.addEventListener("DOMContentLoaded", () => {
  // 1. Define las ubicaciones de tus componentes
  const components = [
    { id: "header-placeholder", url: "header.html" },
    { id: "footer-placeholder", url: "footer.html" },
    { id: "talles-placeholder", url: "guia-talles.html" },
  ];

  // 2. Función para cargar un componente
  const fetchComponent = async (component) => {
    try {
      const response = await fetch(component.url);
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${component.url}`);
      }
      const text = await response.text();
      const placeholder = document.getElementById(component.id);
      if (placeholder) {
        placeholder.innerHTML = text;
      } else {
        console.warn(`No se encontró el placeholder: #${component.id}`);
      }
    } catch (error) {
      console.error("Error cargando componente:", error);
    }
  };

  // 3. Carga todos los componentes en paralelo
  Promise.all(components.map(fetchComponent)).then(() => {
    // 4. ¡ÉXITO! El HTML está en la página.
    //    Ahora cargamos el script.js que los necesita.
    loadMainScript();
  });

  // 5. Función para cargar tu script.js principal
  const loadMainScript = () => {
    const script = document.createElement("script");
    script.src = "js/script.js";

    // ▼▼▼ ESTA ES LA PARTE NUEVA Y MÁS IMPORTANTE ▼▼▼
    script.onload = () => {
      // Esta función se ejecuta DESPUÉS de que js/script.js se cargó
      try {
        // Ahora llamamos a la función que está dentro de script.js
        runApp();
      } catch (e) {
        console.error("Error al ejecutar runApp():", e);
      }
    };
    // ▲▲▲ FIN DE LA PARTE NUEVA ▲▲▲

    document.body.appendChild(script);
  };
});

