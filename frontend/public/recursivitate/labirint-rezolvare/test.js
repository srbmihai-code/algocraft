function runTest() {
  const btn = document.getElementById("btnExploreaza");
  const celuleFinal = document.querySelectorAll(".celula.final");

  if (!btn) {
    return { pass: false, message: "❌ Butonul Explorează nu a fost găsit." };
  }

  if (celuleFinal.length === 0) {
    return { pass: false, message: "❌ Nu există nicio celulă marcată ca final." };
  }

  btn.click();

  const solutie = document.querySelectorAll(".celula.solutie");

  if (solutie.length === 0) {
    return {
      pass: false,
      message: "❌ Nicio celulă din traseu nu a fost marcată cu clasa solutie."
    };
  }
  
  return {
    pass: true,
    message: "✅ Traseul către ieșire a fost marcat corect cu clasa solutie."
  }
}
