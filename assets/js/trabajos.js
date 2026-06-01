// ---------- Galeria de trabajos ----------

const contenedor = document.querySelector("#trabajos");
const overlay = document.querySelector("#overlay");
const overlayContenido = document.querySelector("#overlay-contenido");
const overlayCerrar = document.querySelector("#overlay-cerrar");

let proyectos = [];
let visorMedia;

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

        html += `
            <div class="burbuja-trabajo ${clasePosicion}" data-id="${proyecto.id}">
                <img src="${proyecto.portada}" alt="${proyecto.nombre}">
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

    abrirOverlay(proyecto);
});


// 5. Inyectar contenido del proyecto en el overlay
const abrirOverlay = (proyecto) => {
    let galeriaHTML = "";
    proyecto.galeria.forEach(item => {
        if (typeof item === "string") {
            galeriaHTML += `<img class="overlay-media" src="${item}" alt="${proyecto.nombre}" data-tipo="imagen" data-src="${item}">`;
        } else if (item.tipo === "video") {
            galeriaHTML += `
                <button class="overlay-media overlay-video-thumb" type="button" data-tipo="video" data-src="${item.src}" aria-label="Abrir video">
                    <video src="${item.src}" muted preload="metadata" playsinline tabindex="-1"></video>
                    <span class="overlay-video-play"></span>
                </button>
            `;
        } else {
            galeriaHTML += `<img class="overlay-media" src="${item.src}" alt="${proyecto.nombre}" data-tipo="imagen" data-src="${item.src}">`;
        }
    });

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

    overlayContenido.querySelectorAll(".overlay-media").forEach(media => {
        media.addEventListener("click", () => {
            abrirVisorMedia(media.dataset.tipo, media.dataset.src, proyecto.nombre);
        });
    });
};


// 6. Cerrar overlay con la X
overlayCerrar.addEventListener("click", () => {
    overlay.classList.remove("activo");
});


// 7. Cerrar overlay al clickar fuera de la caja
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("activo");
    }
});
