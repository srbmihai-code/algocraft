// Nodul listei
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Lista simplă înlănțuită
class ListaSimpla {
  constructor() {
    this.head = null;
  }

  // Adaugă un element la început
  addFirst(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
  }

  // Adaugă un element la final
  addLast(value) {
    const newNode = new Node(value);

    if (this.head === null) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next !== null) {
      current = current.next;
    }

    current.next = newNode;
  }

  // Șterge prima apariție a unei valori
  remove(value) {
    if (this.head === null) {
      return;
    }

    if (this.head.value === value) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    while (current.next !== null && current.next.value !== value) {
      current = current.next;
    }

    if (current.next !== null) {
      current.next = current.next.next;
    }
  }

  // Implementează metoda search
  search(value) {
    
  }
}
