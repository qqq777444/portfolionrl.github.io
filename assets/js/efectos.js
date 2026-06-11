// ---------- Efectos de texto con plugins oficiales de GSAP ----------

// Registramos el plugin (necesario para que funcione)
gsap.registerPlugin(ScrambleTextPlugin, TextPlugin);

// ----- Cursor personalizado -----
const cursor = document.createElement("div");
cursor.className = "cursor-personalizado";
document.body.appendChild(cursor);
document.body.classList.add("cursor-activo");
gsap.set(cursor, {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
});

window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: "power2.out"
    });
});

window.addEventListener("mousedown", () => {
    cursor.classList.add("pulsando");
});

window.addEventListener("mouseup", () => {
    cursor.classList.remove("pulsando");
});

document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, .burbuja-trabajo, .overlay-galeria img, .overlay-galeria video")) {
        cursor.classList.add("sobre-hover");
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, .burbuja-trabajo, .overlay-galeria img, .overlay-galeria video")) {
        cursor.classList.remove("sobre-hover");
    }
});

// ----- 1. SCRAMBLE TEXT en los enlaces del header -----
document.querySelectorAll(".header-nav a").forEach(enlace => {
    enlace.addEventListener("mouseenter", () => {
        gsap.to(enlace, {
            duration: 1,
            scrambleText: {
                text: enlace.textContent,
                chars: "!<>-_\\/[]{}—=+*^?#",
                revealDelay: 0.2,
                speed: 0.5
            }
        });
    });
});


// ----- 2. SCRAMBLE TEXT en el logo NagaRL -----
document.querySelectorAll(".header-logo").forEach(logo => {
    logo.addEventListener("mouseenter", () => {
        gsap.to(logo, {
            duration: 1,
            scrambleText: {
                text: logo.textContent,
                chars: "!<>-_\\/[]{}—=+*^?#",
                revealDelay: 0.2,
                speed: 0.5
            }
        });
    });
});


// ----- 3. TYPEWRITER para el overlay -----
window.escribirTexto = (elemento, texto, duracion = 1) => {
    // Forzamos vaciar primero
    elemento.textContent = "";
    
    // Pequeño retraso para asegurar que el DOM se actualizó
    requestAnimationFrame(() => {
        gsap.to(elemento, {
            duration: duracion,
            text: {
                value: texto
            },
            ease: "none"
        });
    });
};
