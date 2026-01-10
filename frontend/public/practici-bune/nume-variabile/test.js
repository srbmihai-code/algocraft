function runTest() {
  if (typeof calculeazaPatrat !== "function") {
    return {
      pass: false,
      message: "❌ Funcția `calculeazaPatrat` nu există sau nu este redenumită corect."
    };
  }

  if (typeof adunaDouaNumere !== "function") {
    return {
      pass: false,
      message: "❌ Funcția `adaugaDouaNumere` nu există sau nu este redenumită corect."
    };
  }

  if (typeof numar === "undefined") {
    return {
      pass: false,
      message: "❌ Variabila `numar` nu există."
    };
  }

  if (typeof sumaNr === "undefined") {
    return {
      pass: false,
      message: "❌ Variabila `sumaNr` nu există."
    };
  }

  return {
    pass: true,
    message: "✅ Funcțiile și variabilele sunt redenumite corect folosind camelCase."
  };
}
