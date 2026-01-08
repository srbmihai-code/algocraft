function runTest() {
  const sarcinaInput = document.getElementById('sarcinaInput');
  const adaugaBtn = document.getElementById('adaugaBtn');
  const proceseazaBtn = document.getElementById('proceseazaBtn');
  const listaSarcini = document.getElementById('coadaSarcini');


  if (!sarcinaInput || !adaugaBtn || !proceseazaBtn || !listaSarcini) {
    return { pass: false, message: '❌ Unul sau mai multe elemente HTML lipsesc.' };
  }

  coadaSarcini.fata = null;
  coadaSarcini.spate = null;
  listaSarcini.innerHTML = '';

  sarcinaInput.value = 'Sarcina 1';
  adaugaBtn.click();

  sarcinaInput.value = 'Sarcina 2';
  adaugaBtn.click();

  sarcinaInput.value = 'Sarcina 3';
  adaugaBtn.click();

  if (coadaSarcini.peek() !== 'Sarcina 1') {
    return { pass: false, message: '❌ Peek trebuie să returneze "Sarcina 1" după adăugarea sarcinilor.' };
  }

  if (listaSarcini.children.length !== 3) {
    return { pass: false, message: '❌ Lista DOM trebuie să aibă 3 sarcini.' };
  }

  proceseazaBtn.click();

  if (coadaSarcini.peek() !== 'Sarcina 2') {
    return { pass: false, message: '❌ Peek trebuie să returneze "Sarcina 2" după procesarea primei sarcini.' };
  }

  if (listaSarcini.children.length !== 2) {
    return { pass: false, message: '❌ Lista DOM trebuie să aibă 2 sarcini după procesarea unei sarcini.' };
  }

  proceseazaBtn.click();
  proceseazaBtn.click();

  if (!coadaSarcini.isEmpty()) {
    return { pass: false, message: '❌ Coada trebuie să fie goală după procesarea tuturor sarcinilor.' };
  }

  if (listaSarcini.children.length !== 0) {
    return { pass: false, message: '❌ Lista DOM trebuie să fie goală după procesarea tuturor sarcinilor.' };
  }

  return { pass: true, message: '✅ Toate operațiile cozii și DOM-ul funcționează corect.' };
}
