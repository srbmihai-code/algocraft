const labirint = document.querySelectorAll(".rand");
const btnExploreaza = document.getElementById("btnExploreaza");

function exploreaza(r, c) {
  // caz de bază – ieșire din labirint
  // caz de bază – perete
  // caz de bază – celulă deja vizitată

  const celula = labirint[r].children[c];

  // marchează celula ca vizitată aplicând clasa .vizitat

  exploreaza(r - 1, c);
  exploreaza(r + 1, c);
  exploreaza(r, c - 1);
  exploreaza(r, c + 1);
}

btnExploreaza.addEventListener("click", () => {
  exploreaza(0, 0);
});
