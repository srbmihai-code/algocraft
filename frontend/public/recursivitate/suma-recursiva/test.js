function runTest() {
  if (typeof sum !== "function") {
    return { pass: false, message: '❌ Funcția `sum` nu este definită.' };
  }

  const tests = [
    { input: [], expected: 0 },
    { input: [1], expected: 1 },
    { input: [1, 2, 3], expected: 6 },
    { input: [5, -2, 7], expected: 10 },
    { input: [10, 20, 30, 40], expected: 100 }
  ];

  for (const { input, expected } of tests) {
    const result = sum(input);
    if (result !== expected) {
      return { pass: false, message: `❌ sum([${input}]) trebuie să fie ${expected}, dar s-a obținut ${result.constructor.name}.` };
    }
  }

  return { pass: true, message: '✅ Funcția `sum` returnează valorile corecte pentru toate testele.' };
}
