function runTest() {
  const container = document.querySelector('.container');
  if (!container) {
    return {
      pass: false,
      message: `❌ Containerul cu clasa .container nu a fost găsit.`
    };
  }

  const important = document.querySelector('#important');
  if (!important) {
    return {
      pass: false,
      message: `❌ Elementul cu id="important" trebuie să existe.`
    };
  }

  const containerStyles = getComputedStyle(container);
  const textAlign = containerStyles.textAlign.trim();

  if (textAlign !== 'center') {
    return {
      pass: false,
      message: `❌ Textul din container trebuie să fie centrat folosind text-align: center, dar s-a găsit "${textAlign}".`
    };
  }

  const importantStyles = getComputedStyle(important);
  const color = importantStyles.color.replace(/\s+/g, '');

  if (color !== "rgb(255,0,0)") {
    return {
      pass: false,
      message: `❌ Paragraful cu id="important" trebuie să aibă color: red, dar s-a găsit "${importantStyles.color}".`
    };
  }

  return {
    pass: true,
    message: `✅ Textul este centrat și paragraful important are culoarea corectă.`
  };
}