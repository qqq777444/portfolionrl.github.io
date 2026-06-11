// ---------- Sistema de traducción ESP / ENG ----------

window.translations = {
    es: {
        nav_galeria: "galería",
        nav_sobremi: "sobre-mí",
        nav_inicio: "inicio",
        home_titulo: "HOLA, BIENVENID@",
        home_redes_instagram: "instagram",
        home_redes_behance: "behance",
        sobremi_titulo: "SOBRE MÍ",
        sobremi_contacto_label: "Contacto:",
        sobremi_saludo: "Hola, soy Naga :)",
        sobremi_texto: "Actualmente vivo en Madrid y soy diseñadora gráfica. Me gusta crear propuestas interesantes que llamen la atención, siempre curiosa y dispuesta a aprender, busco experimentar y colaborar con otros."
    },
    en: {
        nav_galeria: "gallery",
        nav_sobremi: "about-me",
        nav_inicio: "home",
        home_titulo: "HI, WELCOME!",
        home_redes_instagram: "instagram",
        home_redes_behance: "behance",
        sobremi_titulo: "ABOUT ME",
        sobremi_contacto_label: "Contact:",
        sobremi_saludo: "Hi, I'm Naga :)",
        sobremi_texto: "I currently live in Madrid and I'm a graphic designer. I like creating interesting proposals that catch the eye, always curious and eager to learn, looking to experiment and collaborate with others."
    }
};

window.getLang = () => localStorage.getItem("lang") || "es";

window.aplicarTraducciones = (lang) => {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const clave = el.dataset.i18n;
        const texto = window.translations[lang][clave];
        if (texto !== undefined) {
            el.textContent = texto;
        }
    });

    document.querySelectorAll(".lang-btn").forEach(boton => {
        boton.classList.toggle("active", boton.dataset.lang === lang);
    });

    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
};

window.setLang = (lang) => {
    if (lang === window.getLang()) return;
    localStorage.setItem("lang", lang);
    window.aplicarTraducciones(lang);
};

window.addEventListener("DOMContentLoaded", () => {
    window.aplicarTraducciones(window.getLang());

    document.querySelectorAll(".lang-btn").forEach(boton => {
        boton.addEventListener("click", () => window.setLang(boton.dataset.lang));
    });
});
