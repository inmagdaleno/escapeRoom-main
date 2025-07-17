document.addEventListener("DOMContentLoaded", () => {
  // Elementos de la interfaz
  const btnComenzar = document.getElementById("btn-comenzar");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const scoreFinalDisplay = document.getElementById("score-final");
  const btnPistaExtra = document.getElementById("btn-pista-extra");
  const btnReiniciar = document.getElementById("btn-reiniciar");

  // Pantallas
  const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
  const pantallaModoJuego = document.getElementById("pantalla-modo-juego");
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

  // Botones de selección de modo
  const btnModoPuntuacion = document.getElementById("btn-modo-puntuacion");
  const btnModoTiempo = document.getElementById("btn-modo-tiempo");

  // Estado del juego
  let gameMode = ""; // 'score' o 'time'
  let score = 400;
  let timeLeft = 30 * 60; // 30 minutos en segundos
  let timerInterval;
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
    timeLeft = 30 * 60; // 30 minutos en segundos
    totalPistasUsadas = 0;
    scoreDisplay.textContent = score;
    updateTimerDisplay();
    clearInterval(timerInterval);

    cambiarPantalla(null, pantallaBienvenida);
    Object.keys(puzzles).forEach(key => {
      const puzzle = puzzles[key];
      puzzle.modal.style.display = "none";
    });
    modalPista.style.display = "none";
    document.getElementById("score-container").style.display = "none";
    document.getElementById("timer-container").style.display = "none";
    btnPistaExtra.style.display = "none";
  }

  // --- NAVEGACIÓN ENTRE PANTALLAS ---
  function cambiarPantalla(pantallaOcultar, pantallaMostrar) {
    if (pantallaOcultar) pantallaOcultar.classList.remove("visible");
    pantallaMostrar.classList.add("visible");

    if (pantallaMostrar !== pantallaBienvenida && pantallaMostrar !== pantallaModoJuego && pantallaMostrar !== pantallaFinal) {
      btnPistaExtra.style.display = "flex";
      if (gameMode === 'score') {
        document.getElementById("score-container").style.display = "block";
        document.getElementById("timer-container").style.display = "none";
      } else if (gameMode === 'time') {
        document.getElementById("score-container").style.display = "none";
        document.getElementById("timer-container").style.display = "block";
      }
    } else {
      btnPistaExtra.style.display = "none";
      document.getElementById("score-container").style.display = "none";
      document.getElementById("timer-container").style.display = "none";
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
            sendGameResult(); // Enviar resultado al finalizar el juego
            if (gameMode === 'score') {
              if (totalPistasUsadas === 0) {
                score += 100;
                alert("¡Felicidades! Has completado el juego sin usar pistas y ganas 100 puntos de bonus.");
              }
              scoreFinalDisplay.textContent = score;
            } else if (gameMode === 'time') {
              clearInterval(timerInterval);
              scoreFinalDisplay.textContent = formatTime(timeLeft);
            }
          }
        }, 1500);
      } else {
        if (gameMode === 'score') {
          score -= 10;
          scoreDisplay.textContent = score;
          puzzle.feedback.textContent = "Incorrecto, prueba de nuevo. Has perdido 10 puntos.";
        } else if (gameMode === 'time') {
          timeLeft -= 120; // Resta 2 minutos
          updateTimerDisplay();
          puzzle.feedback.textContent = "Incorrecto, prueba de nuevo. Has perdido 2 minutos.";
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("¡Se acabó el tiempo! Fin del juego.");
            inicializarJuego();
            return;
          }
        }
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
      if (gameMode === 'score') {
        score -= 25;
        scoreDisplay.textContent = score;
      } else if (gameMode === 'time') {
        timeLeft -= 120; // Resta 2 minutos
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert("¡Se acabó el tiempo! Fin del juego.");
          inicializarJuego();
          return;
        }
      }
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

  // --- LÓGICA DEL TEMPORIZADOR ---
  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("¡Se acabó el tiempo! Fin del juego.");
        inicializarJuego();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // --- FUNCIÓN PARA ENVIAR RESULTADOS DE LA PARTIDA ---
  function sendGameResult() {
    const gameData = {
      // !!! IMPORTANTE: Reemplaza 1 con el ID real del usuario logueado
      id_usuario: 1, 
      modo_juego: gameMode,
      pistas_usadas: totalPistasUsadas,
      resultado: 1 // 1 para partida completada
    };

    if (gameMode === 'score') {
      gameData.puntuacion_final = score;
      gameData.tiempo_restante_final = null;
    } else if (gameMode === 'time') {
      gameData.puntuacion_final = null;
      gameData.tiempo_restante_final = timeLeft;
    }

    fetch('controller/guardarPartida.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor al guardar partida:', data);
      if (data.success) {
        console.log('Partida guardada con éxito.');
      } else {
        console.error('Error al guardar partida:', data.mensaje);
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud de guardar partida:', error);
    });
  }

  // --- EVENTOS PRINCIPALES ---
  btnComenzar.addEventListener("click", () => {
    cambiarPantalla(pantallaBienvenida, pantallaModoJuego);
  });

  btnModoPuntuacion.addEventListener("click", () => {
    gameMode = 'score';
    cambiarPantalla(pantallaModoJuego, escenaPlaya);
    document.getElementById("score-container").style.display = "block";
    document.getElementById("timer-container").style.display = "none";
  });

  btnModoTiempo.addEventListener("click", () => {
    gameMode = 'time';
    cambiarPantalla(pantallaModoJuego, escenaPlaya);
    document.getElementById("score-container").style.display = "none";
    document.getElementById("timer-container").style.display = "block";
    startTimer();
  });

  btnReiniciar.addEventListener("click", inicializarJuego);

  // Iniciar el juego por primera vez
  inicializarJuego();
});