function proceseazaComanda(pretProdus, cantitate, areReducere) {
  let total = pretProdus * cantitate;

  if (areReducere) {
    total = total * 0.9;
  }

  const mesaj = "Total de plată: " + total + " lei";

  const rezultatEl = document.createElement("div");
  rezultatEl.textContent = mesaj;
  document.body.appendChild(rezultatEl);
}

proceseazaComanda(50, 3, true);
