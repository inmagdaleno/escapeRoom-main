document.addEventListener("DOMContentLoaded", () => {
  // Elementos de la interfaz
  const btnComenzar = document.getElementById("btn-comenzar");
  const scoreDisplay = document.getElementById("score");
  const scoreFinalDisplay = document.getElementById("score-final");
  const btnPistaExtra = document.getElementById("btn-pista-extra");
  const btnReiniciar = document.getElementById("btn-reiniciar");

  // Pantallas
  const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
  const escenaPlaya = document.getElementById("escena-playa");
  const escenaJungla = document.getElementById("escena-jungla");
  const escenaCueva = document.getElementById("escena-cueva");
  const escenaFaro = document.getElementById("escena-faro");
  const pantallaFinal = document.getElementById("pantalla-final");

  // Modales
  const modalPista = document.getElementById("modal-pista");
  const cerrarModalPista = document.getElementById("cerrar-modal-pista");
  const pistaImg = document.getElementById("pista-img");
  const feedbackPista = document.getElementById("feedback-pista");
  const btnSegundaPista = document.getElementById("btn-segunda-pista");
  const btnCerrarPista = document.getElementById("btn-cerrar-pista");

  // Estado del juego
  let score = 400;
  let pistasUsadasPuzzle = 0; // Pistas usadas en el puzzle actual
  let totalPistasUsadas = 0; // Pistas usadas en todo el juego
  let puzzleActual = "";

  const puzzles = {
    puzzle1: {
      modal: document.getElementById("modal1"),
      respuesta: "laislaerrante",
      btnVer: document.getElementById("btn-ver-papel"),
      btnResolver: document.getElementById("btn-resolver-puzzle1"),
      input: document.getElementById("respuesta-puzzle1"),
      feedback: document.getElementById("feedback-puzzle1"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle1"),
      escenaSiguiente: escenaJungla,
    },
    puzzle2: {
      modal: document.getElementById("modal2"),
      respuesta: "unmapa",
      btnVer: document.getElementById("btn-ver-puzzle2"),
      btnResolver: document.getElementById("btn-resolver-puzzle2"),
      input: document.getElementById("respuesta-puzzle2"),
      feedback: document.getElementById("feedback-puzzle2"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle2"),
      escenaSiguiente: escenaCueva,
    },
    puzzle3: {
      modal: document.getElementById("modal3"),
      respuesta: "ninguno",
      btnVer: document.getElementById("btn-ver-puzzle3"),
      btnResolver: document.getElementById("btn-resolver-puzzle3"),
      input: document.getElementById("respuesta-puzzle3"),
      feedback: document.getElementById("feedback-puzzle3"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle3"),
      escenaSiguiente: escenaFaro,
    },
    puzzle4: {
      modal: document.getElementById("modal4"),
      respuesta: "unaaguja",
      btnVer: document.getElementById("btn-ver-puzzle4"),
      btnResolver: document.getElementById("btn-resolver-puzzle4"),
      input: document.getElementById("respuesta-puzzle4"),
      feedback: document.getElementById("feedback-puzzle4"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle4"),
      escenaSiguiente: pantallaFinal,
    },
  };

  const pistas = {
    puzzle1: ["img/pista1_1.jpg", "img/pista1_2.jpg"],
    puzzle2: ["img/pista2_1.jpg", "img/pista2_2.jpg"],
    puzzle3: ["img/pista3_1.jpg", "img/pista3_2.jpg"],
    puzzle4: ["img/pista4_1.jpg", "img/pista4_2.jpg"],
  };

  // --- INICIALIZACIÓN DEL JUEGO ---
  function inicializarJuego() {
    score = 400;
    totalPistasUsadas = 0;
    scoreDisplay.textContent = score;
    cambiarPantalla(pantallaFinal, pantallaBienvenida);
    Object.keys(puzzles).forEach(key => {
      const puzzle = puzzles[key];
      puzzle.modal.style.display = "none";
    });
    modalPista.style.display = "none";
    btnPistaExtra.style.display = "none";
  }

  // --- NAVEGACIÓN ENTRE PANTALLAS ---
  function cambiarPantalla(pantallaOcultar, pantallaMostrar) {
    if (pantallaOcultar) pantallaOcultar.classList.remove("visible");
    pantallaMostrar.classList.add("visible");

    if (pantallaMostrar !== pantallaBienvenida && pantallaMostrar !== pantallaFinal) {
      btnPistaExtra.style.display = "flex";
    } else {
      btnPistaExtra.style.display = "none";
    }
  }

  // --- LÓGICA DE LOS PUZZLES ---
  function setupPuzzle(puzzleKey) {
    const puzzle = puzzles[puzzleKey];

    puzzle.btnVer.addEventListener("click", () => {
      puzzleActual = puzzleKey;
      pistasUsadasPuzzle = 0;
      puzzle.modal.style.display = "flex";
      puzzle.input.value = "";
      puzzle.feedback.style.display = "none";
    });

    puzzle.cerrarModal.addEventListener("click", () => {
      puzzle.modal.style.display = "none";
    });

    puzzle.btnResolver.addEventListener("click", () => {
      if (puzzle.input.value.trim().toLowerCase() === puzzle.respuesta) {
        puzzle.feedback.textContent = "¡Correcto!";
        puzzle.feedback.className = "success";
        puzzle.feedback.style.display = "block";
        setTimeout(() => {
          puzzle.modal.style.display = "none";
          const pantallaActual = puzzle.btnVer.closest(".pantalla");
          cambiarPantalla(pantallaActual, puzzle.escenaSiguiente);
          if (puzzle.escenaSiguiente === pantallaFinal) {
            if (totalPistasUsadas === 0) {
              score += 100;
              alert("¡Felicidades! Has completado el juego sin usar pistas y ganas 100 puntos de bonus.");
            }
            scoreFinalDisplay.textContent = score;
          }
        }, 1500);
      } else {
        score -= 10;
        scoreDisplay.textContent = score;
        puzzle.feedback.textContent = "Incorrecto, prueba de nuevo. Has perdido 10 puntos.";
        puzzle.feedback.className = "error";
        puzzle.feedback.style.display = "block";
      }
    });
  }

  Object.keys(puzzles).forEach(setupPuzzle);

  // --- LÓGICA DE PISTAS ---
  function pedirPista() {
    if (pistasUsadasPuzzle < 2) {
      const pistaActualSrc = pistas[puzzleActual][pistasUsadasPuzzle];
      pistaImg.src = pistaActualSrc;
      modalPista.style.display = "flex";
      score -= 25;
      scoreDisplay.textContent = score;
      pistasUsadasPuzzle++;
      totalPistasUsadas++;
      feedbackPista.textContent = "";
      btnSegundaPista.style.display = pistasUsadasPuzzle === 1 ? "block" : "none";
    } else {
      feedbackPista.textContent = "Ya has usado todas las pistas para este puzzle.";
      pistaImg.src = "";
      modalPista.style.display = "flex";
      btnSegundaPista.style.display = "none";
    }
  }

  btnPistaExtra.addEventListener("click", pedirPista);
  btnSegundaPista.addEventListener("click", pedirPista);
  btnCerrarPista.addEventListener("click", () => (modalPista.style.display = "none"));
  cerrarModalPista.addEventListener("click", () => (modalPista.style.display = "none"));

  // --- EVENTOS PRINCIPALES ---
  btnComenzar.addEventListener("click", () => {
    cambiarPantalla(pantallaBienvenida, escenaPlaya);
  });

  btnReiniciar.addEventListener("click", inicializarJuego);

  // Iniciar el juego por primera vez
  inicializarJuego();
});
