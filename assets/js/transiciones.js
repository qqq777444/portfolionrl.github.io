// ---------- Transiciones suaves entre páginas ----------

// 1. ENTRADA: cuando carga la página, los elementos aparecen con fade-in desde abajo
window.addEventListener("DOMContentLoaded", () => {
    gsap.from("body > *:not(script):not(#trabajos):not(#overlay):not(.burbujas):not(.home-redes)", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out"
    });
});


// 2. SALIDA: al hacer click en un enlace interno, todo se desvanece antes de navegar
document.addEventListener("click", (e) => {
    const enlace = e.target.closest("a");
    if (!enlace) return;

    const href = enlace.getAttribute("href");

    if (!href || !href.endsWith(".html")) return;

    e.preventDefault();

    gsap.to("body > *:not(script)", {
        opacity: 0,
        y: -30,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.in",
        onComplete: () => {
            window.location.href = href;
        }
    });
});