document.addEventListener("DOMContentLoaded", () => {
    iniciarMenu();
    actualizarAnio();
    iniciarFiltrosGaleria();
    iniciarVisorImagenes();
    iniciarBuscadorDocentes();
});

/* ========================================
   1. MENÚ DE NAVEGACIÓN
======================================== */

function iniciarMenu() {
    const boton = document.getElementById("menu-boton");
    const navegacion = document.getElementById("navegacion");

    if (!boton || !navegacion) return;

    boton.addEventListener("click", () => {
        const abierto = navegacion.classList.toggle("activo");

        boton.setAttribute("aria-expanded", String(abierto));
        boton.setAttribute(
            "aria-label",
            abierto ? "Cerrar menú" : "Abrir menú"
        );
    });

    navegacion.querySelectorAll("a").forEach(enlace => {
        enlace.addEventListener("click", () => {
            navegacion.classList.remove("activo");
            boton.setAttribute("aria-expanded", "false");
            boton.setAttribute("aria-label", "Abrir menú");
        });
    });
}

/* ========================================
   2. AÑO AUTOMÁTICO DEL PIE DE PÁGINA
======================================== */

function actualizarAnio() {
    const elementoAnio = document.getElementById("anio");

    if (elementoAnio) {
        elementoAnio.textContent = new Date().getFullYear();
    }
}

/* ========================================
   3. FILTROS DE LA GALERÍA
======================================== */

function iniciarFiltrosGaleria() {
    const botones = document.querySelectorAll("[data-filtro]");
    const fotos = document.querySelectorAll(".foto");

    if (!botones.length || !fotos.length) return;

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const filtro = boton.dataset.filtro;

            botones.forEach(item => {
                item.classList.remove("activo");
            });

            boton.classList.add("activo");

            fotos.forEach(foto => {
                const categoria = foto.dataset.categoria;

                foto.hidden =
                    filtro !== "todas" && categoria !== filtro;
            });
        });
    });
}

/* ========================================
   4. VISOR DE IMÁGENES
======================================== */

function iniciarVisorImagenes() {
    const visor = document.getElementById("visor-imagen");
    const imagenAmpliada = document.getElementById("imagen-ampliada");
    const descripcion = document.getElementById("descripcion-imagen");
    const botonCerrar = document.getElementById("cerrar-visor");

    if (!visor || !imagenAmpliada || !botonCerrar) return;

    document.querySelectorAll(".galeria img").forEach(imagen => {
        imagen.addEventListener("click", () => {
            imagenAmpliada.src = imagen.src;
            imagenAmpliada.alt = imagen.alt;

            if (descripcion) {
                descripcion.textContent = imagen.alt;
            }

            if (typeof visor.showModal === "function") {
                visor.showModal();
            }
        });
    });

    botonCerrar.addEventListener("click", () => {
        if (typeof visor.close === "function") {
            visor.close();
        }
    });

    visor.addEventListener("click", evento => {
        if (evento.target === visor) {
            visor.close();
        }
    });
}

/* ========================================
   5. BUSCADOR DEL DIRECTORIO DOCENTE
======================================== */

function iniciarBuscadorDocentes() {
    const buscador = document.getElementById("buscarDocente");
    const lista = document.getElementById("listaDocentes");
    const cantidad = document.getElementById("cantidadDocentes");
    const mensajeVacio = document.getElementById("sinDocentes");

    if (!buscador || !lista) return;

    const tarjetas = Array.from(
        lista.querySelectorAll(".docente-card")
    );

    function normalizar(texto) {
        return texto
            .toLocaleLowerCase("es-MX")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function buscarDocentes() {
        const termino = normalizar(buscador.value);
        let encontrados = 0;

        tarjetas.forEach(tarjeta => {
            const datos = tarjeta.dataset.busqueda || "";
            const textoTarjeta = tarjeta.textContent || "";

            const contenido = normalizar(
                datos + " " + textoTarjeta
            );

            const coincide = contenido.includes(termino);

            tarjeta.hidden = !coincide;

            if (coincide) {
                encontrados++;
            }
        });

        if (cantidad) {
            cantidad.textContent =
                encontrados === 1
                    ? "1 docente encontrado"
                    : `${encontrados} docentes encontrados`;
        }

        if (mensajeVacio) {
            mensajeVacio.hidden = encontrados > 0;
        }
    }

    buscador.addEventListener("input", buscarDocentes);

    buscarDocentes();
}

 // 7. Evitar que los videos mezclen sus sonidos
document.addEventListener("DOMContentLoaded", function () {
    const videos = document.querySelectorAll("video");
    const musica = document.getElementById("musicaFondo");
    const botonMusica = document.getElementById("botonMusica");

    videos.forEach(function (videoActual) {
        videoActual.addEventListener("play", function () {

            // Pausar los demás videos
            videos.forEach(function (otroVideo) {
                if (otroVideo !== videoActual) {
                    otroVideo.pause();
                }
            });

            // Pausar la música de fondo para evitar mezclar sonidos
            if (musica && !musica.paused) {
                musica.pause();

                if (botonMusica) {
                    botonMusica.textContent = "▶ Música";
                }
            }
        });
    });
});