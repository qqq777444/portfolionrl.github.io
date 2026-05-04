// ---------- Galería de trabajos ----------

const contenedor = document.querySelector("#trabajos");
const overlay = document.querySelector("#overlay");
const overlayContenido = document.querySelector("#overlay-contenido");
const overlayCerrar = document.querySelector("#overlay-cerrar");

let proyectos = [];


// 1. Cargar JSON y pintar burbujas
fetch("./assets/data/data.json")
    .then(response => response.json())
    .then(data => {
        proyectos = data;
        pintarBurbujas();
        animarBurbujas();
    })
    .catch(error => console.error("Error cargando JSON:", error));


// 2. Pintar las burbujas en el HTML
const pintarBurbujas = () => {
    let html = "";

    proyectos.forEach((proyecto, i) => {
        const claseBorde = proyecto.borde === "grueso" ? "borde-grueso" : "borde-fino";
        const clasePosicion = `burbuja-trabajo-${i + 1}`;

        html += `
            <div class="burbuja-trabajo ${clasePosicion} ${claseBorde}" data-id="${proyecto.id}">
                <img src="${proyecto.portada}" alt="${proyecto.nombre}">
            </div>
        `;
    });

    contenedor.innerHTML = html;
};


// 3. Animar las burbujas: aparición + flotar + reacción al ratón
const animarBurbujas = () => {
    const burbujas = document.querySelectorAll(".burbuja-trabajo");

    // Aparición con escala desde 0.5 hasta 1
    gsap.from(burbujas, {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.4)",
        onComplete: () => {
            // Cuando termina la aparición, empieza el flotar continuo
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

    // Reacción sutil al movimiento del ratón
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


// 4. Click en burbuja → abrir overlay con la info del proyecto
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
            galeriaHTML += `<img src="${item}" alt="${proyecto.nombre}">`;
        } else if (item.tipo === "video") {
            galeriaHTML += `<video src="${item.src}" controls style="width:100%;display:block;"></video>`;
        } else {
            const style = item.ancho && item.alto
                ? `width:100%;height:${item.alto}px;object-fit:cover;display:block;`
                : `display:block;`;
            galeriaHTML += `<img src="${item.src}" alt="${proyecto.nombre}" style="${style}">`;
        }
    });

    overlayContenido.innerHTML = `
        <h2 class="overlay-titulo"></h2>
        <p class="overlay-descripcion">${proyecto.descripcion}</p>
        <h3 class="overlay-galeria-titulo">Galería</h3>
        <div class="overlay-galeria">
            ${galeriaHTML}
        </div>
    `;

    overlay.classList.add("activo");

    // Efecto typewriter en el título
    const titulo = overlayContenido.querySelector(".overlay-titulo");
    window.escribirTexto(titulo, proyecto.nombre.toUpperCase());
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