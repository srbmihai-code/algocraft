function runTest() {
  const btn = document.getElementById("btnExploreaza");
  const celule = document.querySelectorAll(".celula");

  if (!btn) {
    return { pass: false, message: "❌ Butonul Explorează nu a fost găsit." };
  }

  if (celule.length === 0) {
    return { pass: false, message: "❌ Nu există celule în labirint." };
  }

  btn.click();

  const vizitate = document.querySelectorAll(".celula.vizitat");

  if (vizitate.length === 0) {
    return {
      pass: false,
      message: "❌ După apăsarea butonului, nicio căsuță nu a fost marcată ca vizitată."
    };
  }

  return {
    pass: true,
    message: "✅ Explorarea pornește corect și căsuțele sunt marcate ca vizitate."
  };
}
