function runTest() {
  if (typeof x === 'undefined') {
    return { pass: false, message: '❌ Variabila x nu este definită.' };
  }

  if (x === 'Hello World') {
    return { pass: true, message: '✅ Corect! x este "Hello World".' };
  } else {
    return { pass: false, message: `❌ Trebuia "Hello World", dar x este "${x}".` };
  }
}
