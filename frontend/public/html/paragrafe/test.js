function runTest() {
  const p = document.querySelector('p');

  if (!p) {
    return { pass: false, message: '❌ Nu a fost găsit niciun element <p>.' };
  }

  const text = p.textContent?.trim() || '';
  if (text.length > 0) {
    return { pass: true, message: '✅ Corect! Paragraful <p> conține text descriptiv.' };
  } else {
    return { pass: false, message: '❌ Paragraful <p> este gol. Trebuia să conțină text descriptiv.' };
  }
}
