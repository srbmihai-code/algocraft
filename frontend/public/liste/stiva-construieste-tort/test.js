function runCakeStackTest() {
  const chocolateBtn = document.getElementById('add-chocolate');
  const vanillaBtn = document.getElementById('add-vanilla');
  const strawberryBtn = document.getElementById('add-strawberry');
  const removeBtn = document.getElementById('remove-top');
  const cakeContainer = document.getElementById('cake');

  if (!chocolateBtn || !vanillaBtn || !strawberryBtn || !removeBtn || !cakeContainer) {
    return { pass: false, message: '❌ Unul sau mai multe elemente HTML nu există.' };
  }

  chocolateBtn.click();
  vanillaBtn.click();
  strawberryBtn.click();

  if (stiva.peek() !== 'Căpșuni') {
    return { pass: false, message: '❌ Peek trebuie să returneze ultimul strat adăugat (Căpșuni).' };
  }

  if (cakeContainer.children.length !== 3) {
    return { pass: false, message: '❌ Containerul cake trebuie să aibă 3 straturi după click-uri.' };
  }

  removeBtn.click();

  if (stiva.peek() !== 'Vanilie') {
    return { pass: false, message: '❌ Peek după pop trebuie să returneze Vanilie.' };
  }

  if (cakeContainer.children.length !== 2) {
    return { pass: false, message: '❌ Containerul cake trebuie să aibă 2 straturi după eliminare.' };
  }

  removeBtn.click();
  removeBtn.click();

  if (!stiva.isEmpty()) {
    return { pass: false, message: '❌ Stiva trebuie să fie goală după eliminarea tuturor straturilor.' };
  }

  if (cakeContainer.children.length !== 0) {
    return { pass: false, message: '❌ Containerul cake trebuie să fie gol după eliminarea tuturor straturilor.' };
  }

  return { pass: true, message: '✅ Butoanele și stiva funcționează corect și sunt sincronizate cu DOM-ul.' };
}
