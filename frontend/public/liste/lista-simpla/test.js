function runTest() {
  if (typeof ListaSimpla !== 'function') {
    return {
      pass: false,
      message: '❌ Clasa LinkedList nu este definită.'
    };
  }

  const list = new ListaSimpla();

  if (typeof list.search !== 'function') {
    return {
      pass: false,
      message: '❌ Metoda search nu este definită în clasa LinkedList.'
    };
  }

  list.addLast(10);
  list.addLast(20);
  list.addLast(30);

  const result1 = list.search(20);
  if (result1 !== true) {
    return {
      pass: false,
      message: '❌ Metoda search trebuie să returneze true pentru o valoare existentă.'
    };
  }

  const result2 = list.search(99);
  if (result2 !== false) {
    return {
      pass: false,
      message: '❌ Metoda search trebuie să returneze false pentru o valoare inexistentă.'
    };
  }

  const emptyList = new ListaSimpla();
  const result3 = emptyList.search(1);
  if (result3 !== false) {
    return {
      pass: false,
      message: '❌ Metoda search trebuie să returneze false pentru o listă goală.'
    };
  }

  return {
    pass: true,
    message: '✅ Metoda search este implementată corect și funcționează pentru toate cazurile testate.'
  };
}
