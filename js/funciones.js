document.addEventListener("DOMContentLoaded", () => {
  const btnComenzar = document.getElementById("btn-comenzar");
  const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
  const escenaPlaya = document.getElementById("escena-playa");

  const btnVerPapel = document.getElementById("btn-ver-papel");
  const modalPuzzle1 = document.getElementById("modal1");
  const cerrarModalPuzzle1 = document.getElementById("cerrar-modal-puzzle1");
  const btnResolverPuzzle1 = document.getElementById("btn-resolver-puzzle1");
  const inputPuzzle1 = document.getElementById("respuesta-puzzle1");
  const feedbackPuzzle1 = document.getElementById("feedback-puzzle1");
  const pergaminoContainer = document.querySelector(".pergamino-container");

  // Comenzar aventura
  btnComenzar.addEventListener("click", () => {
    pantallaBienvenida.classList.remove("visible");
    escenaPlaya.classList.add("visible");
  });

  // Abrir modal del puzzle
  btnVerPapel.addEventListener("click", () => {
    modalPuzzle1.style.display = "flex";
    feedbackPuzzle1.style.display = "none";
    inputPuzzle1.value = "";
  });

  // Autofocus al entrar con el ratón
  inputPuzzle1.addEventListener("mouseenter", () => {
    inputPuzzle1.focus();
  });

  // Perder focus al salir
  inputPuzzle1.addEventListener("mouseleave", () => {
    inputPuzzle1.blur();
  });

  // Validación de caracteres en tiempo real
  inputPuzzle1.addEventListener("input", (e) => {
    let value = e.target.value;

    // Permitir solo letras (mayúsculas o minúsculas)
    const soloLetras = /^[a-zA-Z]*$/;
    if (!soloLetras.test(value.replace(/\s/g, ""))) {
      feedbackPuzzle1.style.display = "block";
      feedbackPuzzle1.textContent = "Solo se permiten letras (A-Z, sin números ni símbolos).";
      feedbackPuzzle1.className = "";
      feedbackPuzzle1.classList.add("warning");
      return;
    }

    // Limitar longitud
    if (value.replace(/\s/g, "").length > 13) {
      feedbackPuzzle1.style.display = "block";
      feedbackPuzzle1.textContent = "La respuesta no puede tener más de 13 letras.";
      feedbackPuzzle1.className = "";
      feedbackPuzzle1.classList.add("warning");
      return;
    }

    // Ocultar feedback si está todo correcto
    feedbackPuzzle1.style.display = "none";
  });

  // Cerrar modal
  cerrarModalPuzzle1.addEventListener("click", () => {
    modalPuzzle1.style.display = "none";
    feedbackPuzzle1.style.display = "none";
  });

  // Resolver puzzle
  btnResolverPuzzle1.addEventListener("click", () => {
    const respuesta = inputPuzzle1.value.trim().toLowerCase().replace(/\s/g, "");

    // Validaciones finales antes de comprobar respuesta
    if (!/^[a-zA-Z]*$/.test(respuesta)) {
      feedbackPuzzle1.style.display = "block";
      feedbackPuzzle1.textContent = "Solo se permiten letras, sin números ni símbolos).";
      feedbackPuzzle1.className = "";
      feedbackPuzzle1.classList.add("warning");
      return;
    }

    if (respuesta.length > 13) {
      feedbackPuzzle1.style.display = "block";
      feedbackPuzzle1.textContent = "La respuesta no puede tener más de 13 letras.";
      feedbackPuzzle1.className = "";
      feedbackPuzzle1.classList.add("warning");
      return;
    }

      if (respuesta === "laislaerrante") {
      // ÉXITO
      feedbackPuzzle1.style.display = "block";
      feedbackPuzzle1.textContent = "¡Enhorabuena! Has resuelto el primer acertijo.";
      feedbackPuzzle1.className = "";
      feedbackPuzzle1.classList.add("success");

      // Ocultar pergamino, imagen, input y botón de resolver
      const pergaminoImg = document.getElementById("pergamino-img");
      if (pergaminoImg) pergaminoImg.style.display = "none";
      if (inputPuzzle1) inputPuzzle1.style.display = "none";
      if (btnResolverPuzzle1) btnResolverPuzzle1.style.display = "none";

      // Crear y añadir el botón de continuar (solo si no existe ya en el modal)
      if (!modalPuzzle1.querySelector("#btn-continuar-puzzle1")) {
        const btnContinua = document.createElement("button");
        btnContinua.id = "btn-continuar-puzzle1";
        btnContinua.textContent = "Continuar";
        btnContinua.className = "btn-continua";

        modalPuzzle1.querySelector(".modal-contenido").appendChild(btnContinua);

        btnContinua.addEventListener("click", () => {
          // Ocultar modal y avanzar a la siguiente pantalla
          modalPuzzle1.style.display = "none";
          escenaPlaya.classList.remove("visible");
          document.getElementById("escena-diario").classList.add("visible");
        });
      }
    } else {
      // ERROR
      feedbackPuzzle1.style.display = "block";
      feedbackPuzzle1.textContent = "Solución incorrecta, inténtalo de nuevo.";
      feedbackPuzzle1.className = "";
      feedbackPuzzle1.classList.add("error");
    }

  });
});