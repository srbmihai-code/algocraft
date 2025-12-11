function runTest() {
  if (typeof x === 'undefined') {
    return { pass: false, message: '❌ Variabila x nu este definită.' };
  }

  if (typeof promovat === 'undefined') {
    return { pass: false, message: '❌ Variabila promovat nu este definită.' };
  }

  // valoarea corectă după condiție
  const expected = (x > 4 && x <= 10);

  if (promovat === expected) {
    return { pass: true, message: '✅ Corect! Ai setat corect variabila promovat în funcție de condiție.' };
  } else {
    return { 
      pass: false, 
      message: `❌ Greșit. Pentru x = ${x}, promovat trebuia să fie ${expected}, dar este ${promovat}.`
    };
  }
}
