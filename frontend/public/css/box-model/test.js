function runTest() {
  const container = document.querySelector('.container');
  if (!container) {
    return { pass: false, message: '❌ Containerul nu există.' };
  }
  const s = getComputedStyle(container);
  if (!s.padding || s.padding === '0px') {
    return { pass: false, message: '❌ padding nu pare setat.' };
  }
  if (!s.borderStyle || s.borderStyle === 'none') {
    return { pass: false, message: '❌ border nu pare setat.' };
  }
  if (!s.margin || s.margin === '0px') {
    return { pass: false, message: '❌ margin pare nu pare setat' };
  }
  return { pass: true, message: '✅ padding, border și margin setate.' };
}
