function runTest() {
  const form = document.querySelector('form');

  if (!form) {
    return { pass: false, message: '❌ Nu a fost găsit niciun element <form>.' };
  }

  const input = form.querySelector('input#nume');
  if (!input) {
    return { pass: false, message: '❌ Formularul trebuie să conțină un input cu id="nume".' };
  }

  const button = form.querySelector('button[type="submit"]');
  if (!button) {
    return { pass: false, message: '❌ Formularul trebuie să conțină un buton de tip submit.' };
  }

  if ((button.textContent || '').trim() !== 'Trimite') {
    return {
      pass: false,
      message: `❌ Textul butonului trebuie să fie "Trimite", dar s-a găsit "${button.textContent?.trim() || ''}".`
    };
  }

  return { pass: true, message: '✅ Formularul conține input-ul și butonul submit corect.' };
}
