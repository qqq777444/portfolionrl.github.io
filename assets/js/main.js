const burbujas = document.querySelectorAll(".burbuja");

burbujas.forEach((burbuja) => {
    gsap.to(burbuja, {
        x: gsap.utils.random(-30, 30),
        y: gsap.utils.random(-25, 25),
        duration: gsap.utils.random(4, 7),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
});

window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    burbujas.forEach((burbuja, i) => {
        const intensidad = 8 + i * 2;
        gsap.to(burbuja, {
            xPercent: x * intensidad,
            yPercent: y * intensidad,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto"
        });
    });
});