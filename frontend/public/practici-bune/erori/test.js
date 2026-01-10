function runTest() {
  if (typeof calculeazaMedie !== "function") {
    return {
      pass: false,
      message: "❌ Funcția `calculeazaMedie` nu există."
    };
  }

  document.body.innerHTML = "";

  let errorCaught = false;
  try {
    calculeazaMedie([]);
  } catch (e) {
    errorCaught = true;
  }

  const div = document.body.lastElementChild;
  if (!div || !div.textContent.toLowerCase().includes("eroare")) {
    return {
      pass: false,
      message: "❌ Funcția `calculeazaMedie` nu afișează eroarea în DOM corespunzător."
    };
  }

  return {
    pass: true,
    message: "✅ Funcția `calculeazaMedie` există și gestionează erorile corect."
  };
}
