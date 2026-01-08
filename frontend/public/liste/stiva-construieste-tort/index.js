class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stiva {
  constructor() {
    this.top = null;
  }

  push(value) {
    const newNode = new Node(value);
    newNode.next = this.top;
    this.top = newNode;
  }

  pop() {
    if (this.isEmpty()) return null;
    const value = this.top.value;
    this.top = this.top.next;
    return value;
  }

  peek() {
    return this.top ? this.top.value : null;
  }

  isEmpty() {
    return this.top === null;
  }
}


const cakeContainer = document.getElementById('cake');
const stiva = new Stiva(); // declararea stivei

document.getElementById('add-chocolate').addEventListener('click', () => {
  const layer = document.createElement('div');
  layer.classList.add('layer', 'chocolate');
  layer.textContent = 'Ciocolată';
  cakeContainer.appendChild(layer);
  // adaugă în stivă
});

document.getElementById('add-vanilla').addEventListener('click', () => {
  const layer = document.createElement('div');
  layer.classList.add('layer', 'vanilla');
  layer.textContent = 'Vanilie';
  cakeContainer.appendChild(layer);
  // adaugă în stivă
});

document.getElementById('add-strawberry').addEventListener('click', () => {
  const layer = document.createElement('div');
  layer.classList.add('layer', 'strawberry');
  layer.textContent = 'Căpșuni';
  cakeContainer.appendChild(layer);
  // adaugă în stivă
});

document.getElementById('remove-top').addEventListener('click', () => {
  const topLayer = cakeContainer.lastElementChild;
  if (topLayer) {
    cakeContainer.removeChild(topLayer);
    // șterge din stivă
  }
});
