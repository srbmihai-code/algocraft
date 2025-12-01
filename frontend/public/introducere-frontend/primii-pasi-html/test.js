function runTest() {
  const h1 = document.querySelector('h1');
  if (!h1) return { pass: false, message: '❌ Nu a fost găsit niciun element <h1>.' };

  const text = h1.textContent?.trim() || '';
  if (text === 'Hello World') {
    return { pass: true, message: '✅ Corect! <h1> spune "Hello World".' };
  } else {
    return { pass: false, message: `❌ Trebuia "Hello World", dar s-a găsit "${text}".` };
  }
}
