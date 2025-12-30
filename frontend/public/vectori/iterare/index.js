const vector = [1, 3, 5, 3, 6];
const container = document.getElementById("container");

function adaugaNumar(valoare) {
  const p = document.createElement("p");
  p.className = "numar";
  p.textContent = valoare;
  container.appendChild(p);
}

// foloseste functia adaugaNumar intr-un for
