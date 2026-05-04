// ---------- Efectos de texto con plugins oficiales de GSAP ----------

// Registramos el plugin (necesario para que funcione)
gsap.registerPlugin(ScrambleTextPlugin, TextPlugin);

// ----- 1. SCRAMBLE TEXT en los enlaces del header -----
document.querySelectorAll(".header a").forEach(enlace => {
    const textoOriginal = enlace.textContent;

    enlace.addEventListener("mouseenter", () => {
        gsap.to(enlace, {
            duration: 1,
            scrambleText: {
                text: textoOriginal,
                chars: "!<>-_\\/[]{}—=+*^?#",
                revealDelay: 0.2,
                speed: 0.5
            }
        });
    });
});


// ----- 2. SCRAMBLE TEXT en el logo NagaRL -----
document.querySelectorAll(".header-logo").forEach(logo => {
    const textoOriginal = logo.textContent;

    logo.addEventListener("mouseenter", () => {
        gsap.to(logo, {
            duration: 1,
            scrambleText: {
                text: textoOriginal,
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