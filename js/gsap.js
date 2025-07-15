document.addEventListener('DOMContentLoaded', () => {
    const contenidoDiv = document.querySelector('.contenido');
    const h1Element = document.querySelector('h1');
    let originalH1Text = h1Element.textContent; // Store original text

    let textScrambleTween; // To hold the GSAP tween for scrambling

    // Function to generate a random character for scrambling
    function getRandomChar() {
        const chars = '!@#$%^&*()_+{}|:"<>?~`-=[]\;,./';
        return chars[Math.floor(Math.random() * chars.length)];
    }

    // Function to scramble the text using GSAP
    function scrambleText(element, text) {
        const textLength = text.length;
        let currentScrambledText = '';

        // Kill any existing scramble tween to prevent conflicts
        if (textScrambleTween) {
            textScrambleTween.kill();
        }

        let frameCounter = 0;
        const updateInterval = 6; // Update text every 4 frames for a slower effect (4 times slower than before)

        textScrambleTween = gsap.to({}, {
            duration: 0.01, // Keep duration very small as it doesn't control update frequency here
            repeat: -1, // Repeat indefinitely
            onUpdate: function() {
                frameCounter++;
                if (frameCounter % updateInterval === 0) {
                    currentScrambledText = '';
                    for (let i = 0; i < textLength; i++) {
                        currentScrambledText += getRandomChar();
                    }
                    element.textContent = currentScrambledText;
                    frameCounter = 0; // Reset counter
                }
            }
        });
    }

    // Evento mouseenter en el div.contenido
    contenidoDiv.addEventListener('mouseenter', () => {
        originalH1Text = h1Element.textContent; // Capture current original text
        scrambleText(h1Element, originalH1Text);
    });

    // Evento mouseleave en el div.contenido
    contenidoDiv.addEventListener('mouseleave', () => {
        if (textScrambleTween) {
            textScrambleTween.kill(); // Stop the scrambling animation
        }
        h1Element.textContent = originalH1Text; // Restore original text
    });

    // Animación inicial del botón (ejemplo de uso de GSAP)
    gsap.from("#iniciarJuego", { duration: 1, y: 50, opacity: 0, ease: "power2.out" });
});