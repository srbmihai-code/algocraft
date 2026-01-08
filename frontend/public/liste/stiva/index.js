// Nodul stivei
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Clasa Stiva bazată pe linked list
class Stiva {
  constructor() {
    this.top = null; // vârful stivei
  }

  // Adaugă un element în vârful stivei
  push(value) {
    const newNode = new Node(value);
    newNode.next = this.top;
    this.top = newNode;
  }

  // Elimină și returnează elementul din vârful stivei
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    const value = this.top.value;
    this.top = this.top.next;
    return value;
  }

  // Verifică dacă stiva este goală
  isEmpty() {
    return this.top === null;
  }
  // Implementează peek()
}
