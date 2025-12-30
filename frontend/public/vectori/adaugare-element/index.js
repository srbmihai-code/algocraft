const container = document.getElementById("container");

function adaugaNumar(valoare) {
  const p = document.createElement("p");
  p.className = "numar";
  p.textContent = valoare;
  container.appendChild(p);
}

// creaza un vector, pune valorile si afiseaza-l
