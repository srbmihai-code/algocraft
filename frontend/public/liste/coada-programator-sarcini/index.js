class Nod {
  constructor(valoare) {
    this.valoare = valoare;
    this.urmator = null;
  }
}

class Coada {
  constructor() {
    this.fata = null;
    this.spate = null;
  }

  enqueue(valoare) {
    const nod = new Nod(valoare);
    if (this.isEmpty()) {
      this.fata = this.spate = nod;
    } else {
      this.spate.urmator = nod;
      this.spate = nod;
    }
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const valoare = this.fata.valoare;
    this.fata = this.fata.urmator;
    if (!this.fata) this.spate = null;
    return valoare;
  }

  peek() {
    return this.fata ? this.fata.valoare : null;
  }

  isEmpty() {
    return this.fata === null;
  }
}

const coadaSarcini = new Coada();

const sarcinaInput = document.getElementById('sarcinaInput');
const adaugaBtn = document.getElementById('adaugaBtn');
const proceseazaBtn = document.getElementById('proceseazaBtn');
const listaSarcini = document.getElementById('coadaSarcini');

adaugaBtn.addEventListener('click', () => {
  const sarcina = sarcinaInput.value.trim();
  if (!sarcina) return;

  const li = document.createElement('li');
  li.textContent = sarcina;
  listaSarcini.appendChild(li);
  sarcinaInput.value = '';
  // adauga in queue
});

proceseazaBtn.addEventListener('click', () => {
  const primaSarcina = listaSarcini.firstElementChild;
  if (!primaSarcina) return;

  listaSarcini.removeChild(primaSarcina);

  // sterge din queue
});
