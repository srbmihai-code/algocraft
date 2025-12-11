function runTest() {
  const button = document.querySelector('button');

  if (!button) {
    return { pass: false, message: '❌ Nu a fost găsit niciun element <button>.' };
  }
  const text = button.textContent?.trim() || '';
  const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (normalizedText === 'Apasa') {
    return { pass: true, message: '✅ Corect! Butonul conține textul "Apasă".' };
  } else {
    return { pass: false, message: `❌ Trebuia textul "Apasă", dar s-a găsit "${text}".` };
  }
}