// ---------- Galeria de trabajos ----------

const contenedor = document.querySelector("#trabajos");
const overlay = document.querySelector("#overlay");
const overlayContenido = document.querySelector("#overlay-contenido");
const overlayCerrar = document.querySelector("#overlay-cerrar");

let proyectos = [];
let visorMedia;
let proyectoActivo = null;

const traducirProyecto = (proyecto) => {
    const lang = window.getLang ? window.getLang() : "es";
    if (lang === "en" && proyecto.en) {
        return { ...proyecto, ...proyecto.en };
    }
    return proyecto;
};

const crearEtiquetas = (etiquetas = []) => {
    if (!etiquetas.length) return "";

    return `
        <ul class="overlay-etiquetas">
            ${etiquetas.map(etiqueta => `<li>${etiqueta}</li>`).join("")}
        </ul>
    `;
};

const pausarVideosGaleria = () => {
    overlayContenido.querySelectorAll("video").forEach(video => {
        video.pause();
    });
    // Detener iframes de Vimeo reseteando su src
    overlayContenido.querySelectorAll(".overlay-vimeo iframe").forEach(iframe => {
        iframe.src = iframe.src;
    });
};

const crearVisorMedia = () => {
    visorMedia = document.createElement("div");
    visorMedia.className = "visor-media";
    visorMedia.innerHTML = `
        <div class="visor-media-caja">
            <button class="visor-media-cerrar" type="button">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="visor-media-contenido"></div>
        </div>
    `;
    document.body.appendChild(visorMedia);

    visorMedia.addEventListener("click", (e) => {
        if (e.target === visorMedia || e.target.closest(".visor-media-cerrar")) {
            cerrarVisorMedia();
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && visorMedia.classList.contains("activo")) {
            cerrarVisorMedia();
        }
    });
};

const abrirVisorMedia = (tipo, src, alt = "") => {
    const contenido = visorMedia.querySelector(".visor-media-contenido");

    if (tipo === "video") {
        pausarVideosGaleria();
    }

    contenido.innerHTML = tipo === "video"
        ? `<video src="${src}" controls autoplay></video>`
        : `<img src="${src}" alt="${alt}">`;

    visorMedia.classList.add("activo");
};

const cerrarVisorMedia = () => {
    const contenido = visorMedia.querySelector(".visor-media-contenido");
    visorMedia.classList.remove("activo");
    contenido.innerHTML = "";
};


// 1. Cargar JSON y pintar burbujas
fetch("./assets/data/data.json")
    .then(response => response.json())
    .then(data => {
        proyectos = data;
        pintarBurbujas();
        animarBurbujas();
        crearVisorMedia();
    })
    .catch(error => console.error("Error cargando JSON:", error));


// 2. Pintar las burbujas en el HTML
const pintarBurbujas = () => {
    let html = "";

    proyectos.forEach((proyecto, i) => {
        const clasePosicion = `burbuja-trabajo-${i + 1}`;
        const traducido = traducirProyecto(proyecto);

        html += `
            <div class="burbuja-trabajo ${clasePosicion}" data-id="${proyecto.id}">
                <img src="${proyecto.portada}" alt="${traducido.nombre}">
            </div>
        `;
    });

    contenedor.innerHTML = html;
};


// 3. Animar las burbujas: aparicion + flotar + reaccion al raton
const animarBurbujas = () => {
    const burbujas = document.querySelectorAll(".burbuja-trabajo");

    gsap.from(burbujas, {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.4)",
        onComplete: () => {
            burbujas.forEach(burbuja => {
                gsap.to(burbuja, {
                    x: gsap.utils.random(-25, 25),
                    y: gsap.utils.random(-20, 20),
                    duration: gsap.utils.random(4, 7),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        }
    });

    window.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        burbujas.forEach((burbuja, i) => {
            const intensidad = 6 + i * 1.5;
            gsap.to(burbuja, {
                xPercent: x * intensidad,
                yPercent: y * intensidad,
                duration: 1.2,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });
};


// 4. Click en burbuja -> abrir overlay con la info del proyecto
contenedor.addEventListener("click", (e) => {
    const burbuja = e.target.closest(".burbuja-trabajo");
    if (!burbuja) return;

    const id = burbuja.dataset.id;
    const proyecto = proyectos.find(p => p.id == id);
    if (!proyecto) return;

    proyectoActivo = proyecto;
    abrirOverlay(traducirProyecto(proyecto));
});


// Si el overlay está abierto al cambiar de idioma, repintar su contenido.
document.addEventListener("langchange", () => {
    if (overlay.classList.contains("activo") && proyectoActivo) {
        abrirOverlay(traducirProyecto(proyectoActivo));
    }
});


// 5. Inyectar contenido del proyecto en el overlay
const abrirOverlay = (proyecto) => {
    // Construir HTML de un único item de galería
    const itemHTML = (item) => {
        if (typeof item === "string") {
            return `<img class="overlay-media" src="${item}" alt="${proyecto.nombre}" data-tipo="imagen" data-src="${item}">`;
        } else if (item.tipo === "vimeo") {
            const ratio = item.ratio || "16/9";
            return `
                <div class="overlay-vimeo" style="aspect-ratio: ${ratio}">
                    <iframe src="https://player.vimeo.com/video/${item.src}?title=0&byline=0&portrait=0&color=ffffff" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>
            `;
        } else if (item.tipo === "video") {
            return `
                <div class="overlay-video">
                    <video class="overlay-media" src="${item.src}" playsinline preload="metadata"></video>
                    <button class="overlay-video-play" type="button" aria-label="Reproducir vídeo">
                        <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
                            <polygon points="16,11 35,22 16,33" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="overlay-video-controles">
                        <div class="overlay-video-barra">
                            <div class="overlay-video-progreso"></div>
                            <span class="overlay-video-marcador"></span>
                        </div>
                        <button class="overlay-video-ampliar" type="button" data-tipo="video" data-src="${item.src}" aria-label="Ver vídeo en grande">
                            <span class="material-symbols-outlined">open_in_full</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            return `<img class="overlay-media" src="${item.src}" alt="${proyecto.nombre}" data-tipo="imagen" data-src="${item.src}">`;
        }
    };

    // Agrupar items consecutivos que compartan la misma propiedad "grupo"
    // en un contenedor .overlay-galeria-grupo (sin gap interno entre ellos).
    let galeriaHTML = "";
    let i = 0;
    const galeria = proyecto.galeria;
    while (i < galeria.length) {
        const item = galeria[i];
        const grupo = typeof item === "object" && item.grupo;
        if (grupo) {
            // Recoger todos los consecutivos del mismo grupo
            let j = i;
            let grupoHTML = "";
            while (j < galeria.length && typeof galeria[j] === "object" && galeria[j].grupo === grupo) {
                grupoHTML += itemHTML(galeria[j]);
                j++;
            }
            galeriaHTML += `<div class="overlay-galeria-grupo">${grupoHTML}</div>`;
            i = j;
        } else {
            galeriaHTML += itemHTML(item);
            i++;
        }
    }

    overlayContenido.innerHTML = `
        <div class="overlay-galeria">
            ${galeriaHTML}
        </div>
        <div class="overlay-info">
            <h2 class="overlay-titulo"></h2>
            ${crearEtiquetas(proyecto.etiquetas)}
            <p class="overlay-descripcion">${proyecto.descripcion}</p>
        </div>
    `;

    overlay.classList.add("activo");

    const titulo = overlayContenido.querySelector(".overlay-titulo");
    window.escribirTexto(titulo, proyecto.nombre.toUpperCase());

    overlayContenido.querySelectorAll("img.overlay-media").forEach(media => {
        media.addEventListener("click", () => {
            abrirVisorMedia(media.dataset.tipo, media.dataset.src, proyecto.nombre);
        });
    });

    // Botón para abrir el vídeo en grande, con la interfaz de reproducción
    // por defecto del navegador (visor flotante existente).
    overlayContenido.querySelectorAll(".overlay-video-ampliar").forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.stopPropagation();
            const contenedor = boton.closest(".overlay-video");
            const video = contenedor?.querySelector("video");
            if (video) video.pause();
            abrirVisorMedia(boton.dataset.tipo, boton.dataset.src, proyecto.nombre);
        });
    });

    // Vídeos con interfaz de reproducción sencilla: miniatura con icono de
    // play, y al reproducir aparece una línea de tiempo minimalista propia.
    overlayContenido.querySelectorAll(".overlay-video").forEach(contenedor => {
        const video = contenedor.querySelector("video");
        const boton = contenedor.querySelector(".overlay-video-play");
        const barra = contenedor.querySelector(".overlay-video-barra");
        const progreso = contenedor.querySelector(".overlay-video-progreso");
        const marcador = contenedor.querySelector(".overlay-video-marcador");

        let arrastrando = false;

        const actualizarBarra = () => {
            if (!video.duration) return;
            const porcentaje = Math.min(Math.max(video.currentTime / video.duration, 0), 1) * 100;
            progreso.style.width = `${porcentaje}%`;
            marcador.style.left = `${porcentaje}%`;
        };

        const buscarPosicion = (e) => {
            if (!video.duration) return;
            const rect = barra.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
            video.currentTime = ratio * video.duration;
            actualizarBarra();
        };

        boton.addEventListener("click", (e) => {
            e.stopPropagation();
            video.play();
        });

        video.addEventListener("click", () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        video.addEventListener("play", () => {
            contenedor.classList.add("reproduciendo");
            contenedor.classList.add("iniciado");
        });
        video.addEventListener("pause", () => contenedor.classList.remove("reproduciendo"));
        video.addEventListener("ended", () => contenedor.classList.remove("reproduciendo"));
        video.addEventListener("timeupdate", actualizarBarra);
        video.addEventListener("loadedmetadata", actualizarBarra);

        barra.addEventListener("mousedown", (e) => {
            arrastrando = true;
            buscarPosicion(e);
        });
        barra.addEventListener("touchstart", (e) => {
            arrastrando = true;
            buscarPosicion(e);
        });

        window.addEventListener("mousemove", (e) => {
            if (arrastrando) buscarPosicion(e);
        });
        window.addEventListener("touchmove", (e) => {
            if (arrastrando) buscarPosicion(e);
        });
        window.addEventListener("mouseup", () => { arrastrando = false; });
        window.addEventListener("touchend", () => { arrastrando = false; });
    });
};


// 6. Cerrar overlay con la X
overlayCerrar.addEventListener("click", () => {
    overlay.classList.remove("activo");
    pausarVideosGaleria();
});


// 7. Cerrar overlay al clickar fuera de la caja
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("activo");
        pausarVideosGaleria();
    }
});
