const labirint = document.querySelectorAll(".rand");
const btnExploreaza = document.getElementById("btnExploreaza");
const traseu = [];

function exploreaza(r, c) {
  // oprire la margini
  if (r < 0 || c < 0 || r >= labirint.length || c >= labirint[r].children.length) {
    return false;
  }

  const celula = labirint[r].children[c];

  // oprire dacă e perete sau deja vizitată
  if (celula.classList.contains("perete") || celula.classList.contains("vizitat")) {
    return false;
  }

  // marchează celula ca vizitată
  celula.classList.add("vizitat");
  traseu.push(celula);

  // verifică cazul de succes (clasa final) și marchează toate celulele din traseu cu clasa solutie

  // explorează vecinii
  if (
    exploreaza(r - 1, c) ||
    exploreaza(r + 1, c) ||
    exploreaza(r, c - 1) ||
    exploreaza(r, c + 1)
  ) {
    return true;
  }

  // backtracking: nu duce la ieșire
  traseu.pop();
  return false;
}

btnExploreaza.addEventListener("click", () => {
  exploreaza(0, 0);
});
