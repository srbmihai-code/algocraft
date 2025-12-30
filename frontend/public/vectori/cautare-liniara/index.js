const container = document.getElementById("container");

function adaugaNumar(valoare) {
  const p = document.createElement("p");
  p.className = "numar";
  p.textContent = valoare;
  container.appendChild(p);
}

function gasestePatrat(index) {
  const patrate = container.querySelectorAll(".numar");
  return patrate[index] || null;
}

const vector = []
for (let i=0;i<11;i++) {
  vector.push(2**i)
}
for (let i=0;i<11;i++) {
  adaugaNumar(vector[i])
}

function gaseste() {
  // codeaza aici
}