document.addEventListener("DOMContentLoaded", () => {
    iniciarMenu();
    actualizarAnio();
    iniciarFiltrosGaleria();
    iniciarVisorImagenes();
    iniciarBuscadorDocentes();
    iniciarNoticias();
    iniciarControlMultimedia();
});

/* =====================================
   1. MENÚ DE NAVEGACIÓN
===================================== */

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

        boton.textContent = abierto ? "✕" : "☰";
    });

    navegacion.querySelectorAll("a").forEach(enlace => {
        enlace.addEventListener("click", () => {
            navegacion.classList.remove("activo");

            boton.setAttribute("aria-expanded", "false");
            boton.setAttribute("aria-label", "Abrir menú");
            boton.textContent = "☰";
        });
    });
}


/* =====================================
   2. AÑO AUTOMÁTICO DEL PIE DE PÁGINA
===================================== */

function actualizarAnio() {
    const anio = document.getElementById("anio");

    if (anio) {
        anio.textContent = new Date().getFullYear();
    }
}


/* =====================================
   3. FILTROS DE LA GALERÍA
===================================== */

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


/* =====================================
   4. VISOR DE IMÁGENES
===================================== */

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


/* =====================================
   5. BUSCADOR DE DOCENTES
===================================== */

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
            const texto = tarjeta.textContent || "";

            const contenido = normalizar(datos + " " + texto);
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


/* =====================================
   6. FILTROS Y CONTENIDO DE NOTICIAS
===================================== */

function iniciarNoticias() {
    const filtros = document.querySelectorAll(".filtro-noticia");
    const tarjetas = document.querySelectorAll(".tarjeta-noticia");

    filtros.forEach(filtro => {
        filtro.addEventListener("click", () => {
            const categoria = filtro.dataset.categoria;

            filtros.forEach(boton => {
                boton.classList.remove("activo");
            });

            filtro.classList.add("activo");

            tarjetas.forEach(tarjeta => {
                const coincide =
                    categoria === "todas" ||
                    tarjeta.dataset.categoria === categoria;

                tarjeta.classList.toggle("oculta", !coincide);
            });
        });
    });

    document.querySelectorAll(".boton-noticia").forEach(boton => {
        boton.addEventListener("click", () => {
            const tarjeta = boton.closest(".tarjeta-noticia");

            if (!tarjeta) return;

            const contenido = tarjeta.querySelector(".texto-completo");

            if (!contenido) return;

            contenido.hidden = !contenido.hidden;

            boton.textContent = contenido.hidden
                ? "Leer noticia"
                : "Cerrar noticia";

            boton.setAttribute(
                "aria-expanded",
                String(!contenido.hidden)
            );
        });
    });
}


/* =====================================
   7. CONTROL DE AUDIO Y VIDEOS
===================================== */

function iniciarControlMultimedia() {
    const elementos = document.querySelectorAll("audio, video");

    const musica = document.getElementById("musicaFondo");
    const botonMusica = document.getElementById("botonMusica");

    // Evita que dos audios o videos se reproduzcan al mismo tiempo.
    elementos.forEach(elementoActual => {
        elementoActual.addEventListener("play", () => {
            elementos.forEach(otroElemento => {
                if (otroElemento !== elementoActual) {
                    otroElemento.pause();
                }
            });

            actualizarBotonMusica();
        });
    });

    // Botón para reproducir o pausar la música.
    if (musica && botonMusica) {
        botonMusica.addEventListener("click", async () => {
            if (musica.paused) {
                try {
                    await musica.play();
                } catch (error) {
                    console.error(
                        "No se pudo reproducir la música:",
                        error
                    );
                }
            } else {
                musica.pause();
            }

            actualizarBotonMusica();
        });

        musica.addEventListener("play", actualizarBotonMusica);
        musica.addEventListener("pause", actualizarBotonMusica);
        musica.addEventListener("ended", actualizarBotonMusica);
    }

    function actualizarBotonMusica() {
        if (!musica || !botonMusica) return;

        botonMusica.textContent = musica.paused
            ? "▶ Música"
            : "⏸ Pausar música";
    }
}
