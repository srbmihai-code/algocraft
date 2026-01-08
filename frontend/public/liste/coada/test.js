function runTest() {
  const queue = new Coada();

  if (queue.peek && queue.peek() !== null) {
    return { pass: false, message: '❌ Peek pe o coadă goală trebuie să returneze null.' };
  }

  queue.enqueue('Primul');
  queue.enqueue('Al doilea');
  queue.enqueue('Al treilea');

  if (!queue.peek || queue.peek() !== 'Primul') {
    return { pass: false, message: '❌ Peek trebuie să returneze "Primul".' };
  }

  if (queue.dequeue() !== 'Primul') {
    return { pass: false, message: '❌ Primul element trebuie să fie "Primul" după peek.' };
  }

  if (queue.peek() !== 'Al doilea') {
    return { pass: false, message: '❌ Peek trebuie să returneze "Al doilea" după primul dequeue.' };
  }

  return { pass: true, message: '✅ Peek funcționează corect pentru coadă.' };
}
