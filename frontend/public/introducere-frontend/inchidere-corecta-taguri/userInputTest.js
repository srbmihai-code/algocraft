function runTest(html) {
  const h1Pattern = /<h1>\s*Bine ai venit la site-ul meu\s*<\/h1>/i;
  const h2Pattern = /<h2>\s*Acesta este site-ul meu\s*<\/h2>/i;
  const h3Pattern = /<h3>\s*Acesta este un subtitlu\s*<\/h3>/i;
  console.log(html, h1Pattern.test(html))
  if (!h1Pattern.test(html)) {
    return { pass: false, message: "❌ <h1> nu este găsit sau nu este închis corect." };
  }

  if (!h2Pattern.test(html)) {
    return { pass: false, message: "❌ <h2> nu este găsit sau nu este închis corect." };
  }

  if (!h3Pattern.test(html)) {
    return { pass: false, message: "❌ <h3> nu este găsit sau nu este închis corect." };
  }

  return {
    pass: true,
    message: "✅ Toate tagurile <h1>, <h2> și <h3> sunt prezente și închise corect!"
  };
}
