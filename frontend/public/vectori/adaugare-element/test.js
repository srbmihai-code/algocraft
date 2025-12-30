function runTest() {
  const expected = [];
  for (let i = 0; i <= 10; i++) {
    expected.push(2 ** i);
  }

  const elements = Array.from(document.querySelectorAll('.numar'));
  if (elements.length !== expected.length) {
    return { 
      pass: false, 
      message: `❌ Trebuiau ${expected.length} elemente cu clasa "numar", dar s-au găsit ${elements.length}.` 
    };
  }

  for (let i = 0; i < expected.length; i++) {
    const value = parseInt(elements[i].textContent || '', 10);
    if (value !== expected[i]) {
      return {
        pass: false,
        message: `❌ Elementul de la index ${i} trebuia să fie ${expected[i]}, dar s-a găsit ${value}.`
      };
    }
  }

  return { pass: true, message: `✅ Corect! Toate elementele sunt puteri ale lui doi de la 2^0 la 2^10.` };
}
