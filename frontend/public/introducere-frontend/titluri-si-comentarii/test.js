function runTest() {
  const h2 = document.querySelector('h2');
  
  if (!h2) {
    return { pass: false, message: '❌ Nu a fost găsit niciun element <h2>.' };
  }

  const text = h2.textContent?.trim() || '';
  if (text === 'Acesta este site-ul meu') {
    return { pass: true, message: '✅ Corect! <h2> conține textul "Acesta este site-ul meu".' };
  } else {
    return { pass: false, message: `❌ Trebuia textul "Acesta este site-ul meu", dar s-a găsit "${text}".` };
  }
}
