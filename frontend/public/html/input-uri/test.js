function runTest() {
  const input = document.querySelector('input');

  if (!input) {
    return { pass: false, message: '❌ Nu a fost găsit niciun element <input>.' };
  }

  const id = input.getAttribute('id') || '';
  if (id !== 'nume') {
    return { pass: false, message: `❌ Input-ul trebuie să aibă atributul id="nume", dar s-a găsit id="${id}".` };
  }

  const type = input.getAttribute('type') || '';
  if (type !== 'text') {
    return { pass: false, message: `❌ Input-ul trebuie să aibă type="text", dar s-a găsit type="${type}".` };
  }

  const placeholder = input.getAttribute('placeholder') || '';
  if (placeholder !== 'Nume') {
    return { pass: false, message: `❌ Input-ul trebuie să aibă placeholder="Nume", dar s-a găsit placeholder="${placeholder}".` };
  }

  return { pass: true, message: '✅ Corect! Input-ul are id="nume", type="text" și placeholder="Nume".' };
}
