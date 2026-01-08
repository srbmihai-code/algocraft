function runTest() {
  if (typeof fibonacci !== "function") {
    return { pass: false, message: '❌ Funcția `fibonacci` nu este definită.' };
  }

  const tests = [
    { input: 0, expected: 0 },
    { input: 1, expected: 1 },
    { input: 2, expected: 1 },
    { input: 5, expected: 5 },
    { input: 10, expected: 55 }
  ];

  for (const { input, expected } of tests) {
    const result = fibonacci(input);
    if (result !== expected) {
      return { pass: false, message: `❌ fibonacci(${input}) trebuie să fie ${expected}, dar s-a obținut ${result}.` };
    }
  }

  return { pass: true, message: '✅ Funcția fibonacci returnează valorile corecte pentru toate testele.' };
}
