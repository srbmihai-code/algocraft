function runTest() {
  if (typeof quickSort !== "function") {
    return { pass: false, message: '❌ Funcția `quickSort` nu este definită.' };
  }

  const tests = [
    { input: [], expected: [] },
    { input: [1], expected: [1] },
    { input: [2, 1], expected: [1, 2] },
    { input: [5, 2, 8, 3], expected: [2, 3, 5, 8] },
    { input: [10, -1, 2, 5, 0], expected: [-1, 0, 2, 5, 10] },
    { input: [3, 3, 1, 2], expected: [1, 2, 3, 3] }
  ];

  for (const { input, expected } of tests) {
    const result = quickSort([...input]); // copy to avoid mutation
    if (JSON.stringify(result) !== JSON.stringify(expected)) {
      return {
        pass: false,
        message: `❌ quickSort([${input}]) trebuie să fie [${expected}], dar s-a obținut [${result}].`
      };
    }
  }

  return { pass: true, message: '✅ Funcția quickSort sortează corect toate testele.' };
}
