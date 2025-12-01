function runTest() {
  const label = document.querySelector('label');
  const input = document.querySelector('input#nume');

  if (!label) {
    return { pass: false, message: '❌ Nu a fost găsit niciun element <label>.' };
  }

  if (!input) {
    return { pass: false, message: '❌ Nu a fost găsit niciun input cu id="nume" pentru label.' };
  }

  const labelFor = label.getAttribute('for') || '';
  const inputId = input.getAttribute('id') || '';

  if (labelFor !== inputId) {
    return {
      pass: false,
      message: `❌ Atributul 'for' al label-ului trebuie să fie "${inputId}", dar s-a găsit "${labelFor}".`
    };
  }

  return { pass: true, message: '✅ Corect! Label-ul există și este legat de input-ul corespunzător.' };
}
