function runTest() {
  const container = document.querySelector('#container');
  if (!container) {
    return {
      pass: false,
      message: '❌ Nu a fost găsit elementul #container.'
    };
  }

  const pElements = container.querySelectorAll('p.numar');
  if (pElements.length === 0) {
    return {
      pass: false,
      message: '❌ Nu există niciun element <p> cu clasa "numar".'
    };
  }

  const valori = Array.from(pElements).map(p => p.textContent.trim());
  const expected = ['1','3','5','3','6'];

  for (let i = 0; i < expected.length; i++) {
    if (valori[i] !== expected[i]) {
      return {
        pass: false,
        message: `❌ Valoare greșită la index ${i}. Așteptat "${expected[i]}", dar s-a găsit "${valori[i]}".`
      };
    }
  }

  return {
    pass: true,
    message: '✅ Corect! Toate elementele <p> au fost adăugate corect cu valorile așteptate.'
  };
}
