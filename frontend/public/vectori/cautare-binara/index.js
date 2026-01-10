const container = document.getElementById("container");

function adaugaNumar(valoare) {
  const p = document.createElement("p");
  p.className = "numar";
  p.textContent = valoare;
  container.appendChild(p);
}

const vector = [];
for (let i = 0; i < 11; i++) {
  vector.push(2 ** i);
}

for (let i = 0; i < vector.length; i++) {
  adaugaNumar(vector[i]);
}

function gasestePatrat(index) {
  return container.children[index];
}

// Funcție pentru căutare binară
function binarySearch(vector, valoare) {
  let low = 0;
  let high = vector.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const element = vector[mid];

    if (element === valoare) {
      return mid;
    }
    if (element < valoare) {
      low = mid + 1;
    }
    // verifica daca elementul este mai mare decat valoarea si seteaza high la mijloc minus 1
  }

  return -1;
}

// Funcția apelată la click pe buton
function gaseste() {
  const input = document.getElementById("numar-input");
  const valoare = parseInt(input.value);

  const index = binarySearch(vector, valoare);

  if (index !== -1) {
    const patrat = gasestePatrat(index);
    patrat.style.backgroundColor = "darkred";
  } else {
    alert("Numărul nu a fost găsit!");
  }
}