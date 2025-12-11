function runTest() {
  const container = document.querySelector('.container');
  if (!container) {
    return { 
      pass: false, 
      message: `❌ Containerul cu clasa .container nu a fost găsit.` 
    };
  }

  const bg = getComputedStyle(container).backgroundColor.trim();
  const expected = 'rgb(250, 235, 215)';

  if (bg !== expected) {
    return {
      pass: false,
      message: `❌ background-color trebuie să fie antiquewhite "${expected}", dar s-a găsit "${bg}".`
    };
  }

  return { 
    pass: true, 
    message: `✅ background-color este setat corect la antiquewhite ${expected}.` 
  };
}
