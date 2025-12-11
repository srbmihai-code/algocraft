function runTest() {
  if (typeof sum === 'undefined') {
    return { pass: false, message: '❌ Variabila sum nu este definită.' };
  }
  // Sum of even numbers from 1 to 1000
  const expected = 250500;
  if (sum === expected) {
    return { pass: true, message: `✅ Corect! Suma numerelor pare de la 1 la 1000 este ${sum}.` };
  } else {
    return { pass: false, message: `❌ Greșit. Suma corectă trebuia să fie ${expected}, dar sum este ${sum}.` };
  }
}
