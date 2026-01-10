function runTest() {
  // Test calculeazaPretFinal
  if (typeof calculeazaPretFinal !== "function") {
    return {
      pass: false,
      message: "❌ Funcția `calculeazaPretFinal` nu există."
    };
  }

  const pret = 100;
  const cant = 2;
  const reducere = true;
  const pretFinal = calculeazaPretFinal(pret, cant, reducere);
  if (typeof pretFinal !== "number") {
    return {
      pass: false,
      message: "❌ Funcția `calculeazaPretFinal` trebuie să returneze un număr."
    };
  }

  // Test creeazaMesaj
  if (typeof creeazaMesaj !== "function") {
    return {
      pass: false,
      message: "❌ Funcția `creeazaMesaj` nu există."
    };
  }

  const mesaj = creeazaMesaj(pretFinal);
  if (typeof mesaj !== "string" || !mesaj.includes(pretFinal)) {
    return {
      pass: false,
      message: "❌ Funcția `creeazaMesaj` trebuie să returneze un string care conține prețul final."
    };
  }

  // Test afiseazaMesaj
  if (typeof afiseazaMesaj !== "function") {
    return {
      pass: false,
      message: "❌ Funcția `afiseazaMesaj` nu există."
    };
  }

  afiseazaMesaj(mesaj);
  const ultimaDiv = document.body.lastElementChild;
  if (!ultimaDiv || ultimaDiv.textContent !== mesaj) {
    return {
      pass: false,
      message: "❌ Funcția `afiseazaMesaj` nu afișează mesajul corect în DOM."
    };
  }

  return {
    pass: true,
    message: "✅ Toate funcțiile există și funcționează corect."
  };
}
