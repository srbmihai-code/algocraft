function runTest(jsCode) {
  console.log(jsCode)
  const functionPattern = /function\s+calculeaza\s*\(\s*a\s*,\s+b\s*\)\s+\{/;
  const ifPattern = /if\s+\(\s*a\s*>\s+10\s*\)\s*\{/;
  const returnPlusPattern = /return\s+a\s+\+\s+b;/;
  const returnMinusPattern = /return\s+a\s+-\s+b;/;

  if (!functionPattern.test(jsCode)) {
    return {
      pass: false,
      message: "❌ Funcția nu este declarată corect sau lipsesc spațiile din semnătură."
    };
  }

  if (!ifPattern.test(jsCode)) {
    return {
      pass: false,
      message: "❌ Instrucțiunea if nu este formatată corect."
    };
  }

  if (!returnPlusPattern.test(jsCode)) {
    return {
      pass: false,
      message: "❌ Operația de adunare nu este formatată corect (necesită spații stânga/dreapta)."
    };
  }

  if (!returnMinusPattern.test(jsCode)) {
    return {
      pass: false,
      message: "❌ Operația de scădere nu este formatată corect (necesită spații stânga/dreapta)."
    };
  }

  return {
    pass: true,
    message: "✅ Codul este curățat și respectă regulile de bază de clean code!"
  };
}
