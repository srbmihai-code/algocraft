function runTest() {
  function getCssPropertyForRule(rule, prop) {
    let sheets = document.styleSheets;
    for (let i = 0; i < sheets.length; i++) {
      let rules = sheets[i].cssRules;
      for (let j = 0; j < rules.length; j++) {
        if (rules[j].selectorText === rule) {
          return rules[j].style[prop];
        }
      }
    }
  }

  const input = document.querySelector('#nume');
  const btn = document.querySelector('#btn-action');

  if (!input || !btn)
    return { pass: false, message: `❌ Elementele #nume și #btn-action trebuie să existe.` };

  const inputStyles = getComputedStyle(input);
  if (parseInt(inputStyles.padding) === 0)
    return { pass: false, message: `❌ Input-ul trebuie să aibă padding.` };
  if (parseInt(inputStyles.borderRadius) === 0)
    return { pass: false, message: `❌ Input-ul trebuie să aibă border-radius.` };
  if (inputStyles.borderStyle === "none")
    return { pass: false, message: `❌ Input-ul trebuie să aibă border.` };

  const btnStyles = getComputedStyle(btn);
  if (parseInt(btnStyles.padding) === 0)
    return { pass: false, message: `❌ Butonul trebuie să aibă padding.` };
  if (parseInt(btnStyles.borderRadius) === 0)
    return { pass: false, message: `❌ Butonul trebuie să aibă border-radius.` };
  if (btnStyles.backgroundColor === "rgba(0, 0, 0, 0)")
    return { pass: false, message: `❌ Butonul trebuie să aibă background-color.` };

  const hoverBg = getCssPropertyForRule('#btn-action:hover', 'background-color');
  if (!hoverBg)
    return { pass: false, message: `❌ Selectorul :hover trebuie să definească un background-color.` };

  return { pass: true, message: `✅ Toate stilurile sunt setate corect, inclusiv :hover.` };
}