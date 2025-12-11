function runTest() {
  if (typeof a === 'undefined' || typeof b === 'undefined') {
    return { pass: false, message: '❌ Variabilele a sau b nu sunt definite.' };
  }

  if (typeof x === 'undefined') {
    return { pass: false, message: '❌ Variabila x nu este definită.' };
  }

  const expected = (a + b) / 2;

  if (x === expected) {
    return { pass: true, message: `✅ Corect! x este media aritmetică: ${x}.` };
  } else {
    return { pass: false, message: `❌ Greșit. x trebuia să fie ${expected}, dar este ${x}.` };
  }
}
