function runTest() {
  if (typeof Stiva !== 'function') {
    return { pass: false, message: '❌ Clasa Stack nu este definită.' };
  }

  const stack = new Stiva();

  if (typeof stack.peek !== 'function') {
    return { pass: false, message: '❌ Metoda peek nu este definită în clasa Stack.' };
  }

  stack.push(10);
  stack.push(20);
  stack.push(30);
  
  const result1 = stack.peek();
  if (result1 !== 30) {
    return { pass: false, message: '❌ Peek trebuie să returneze 30 pentru vârful stivei.' };
  }

  stack.pop();
  const result2 = stack.peek();
  if (result2 !== 20) {
    return { pass: false, message: '❌ Peek trebuie să returneze 20 după pop.' };
  }

  const emptyStack = new Stiva();
  const result3 = emptyStack.peek();
  if (result3 !== null) {
    return { pass: false, message: '❌ Peek trebuie să returneze null pentru o stivă goală.' };
  }

  return { pass: true, message: '✅ Metoda peek funcționează corect pentru toate cazurile.' };
}
