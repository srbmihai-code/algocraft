function runTest() {
  const h1 = document.querySelector('h1');
  const p = document.querySelector('p');

  if (!h1) {
    return { pass: false, message: `❌ Elementul <h1> nu a fost găsit.` };
  }
  if (!p) {
    return { pass: false, message: `❌ Elementul <p> nu a fost găsit.` };
  }

  const h1Font = getComputedStyle(h1).fontFamily.toLowerCase();
  if (!h1Font.includes('arial')) {
    return {
      pass: false,
      message: `❌ Fontul titlului <h1> trebuie să fie Arial, dar s-a găsit "${h1Font}".`
    };
  }

  const pFont = getComputedStyle(p).fontFamily.toLowerCase();
  if (!pFont.includes('arial')) {
    return {
      pass: false,
      message: `❌ Fontul paragrafului <p> trebuie să fie Arial, dar s-a găsit "${pFont}".`
    };
  }

  const pColor = getComputedStyle(p).color.trim();
  const expectedColor = 'rgb(75, 54, 33)';

  if (pColor !== expectedColor) {
    return {
      pass: false,
      message: `❌ Culoarea textului paragrafului <p> trebuie să fie "${expectedColor}", dar s-a găsit "${pColor}".`
    };
  }

  return {
    pass: true,
    message: `✅ Titlul <h1> și paragraful <p> au fontul corect și culoarea paragrafului setată corect.`
  };
}
