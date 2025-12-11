function runTest() {
  if (typeof sum === 'undefined') {
    return { pass: false, message: '❌ Funcția sum nu este definită.' };
  }

  if (typeof sum !== 'function') {
    return { pass: false, message: '❌ sum trebuie să fie o funcție.' };
  }

  const x = 10;
  const expected = 30;

  const result = sum(x);

  if (typeof result !== 'number') {
    return { pass: false, message: '❌ Funcția sum trebuie să returneze un număr.' };
  }

  if (result === expected) {
    return { pass: true, message: '✅ Corect! Funcția sum returnează suma numerelor pare.' };
  } else {
    return {
      pass: false,
      message: `❌ Greșit. Pentru x = ${x}, rezultatul corect este ${expected}, dar funcția a returnat ${result}.`
    };
  }
}
