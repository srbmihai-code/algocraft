function runTest() {
  const input = document.getElementById("numar-input");
  const button = document.getElementById("cauta-btn");
  const container = document.getElementById("container");
  if (!input || !button || !container) {
    return { pass: false, message: "❌ Lipsește input, button sau container." };
  }

  const pElements = Array.from(container.querySelectorAll("p.numar"));
  if (pElements.length !== 11) {
    return { pass: false, message: "❌ Ar trebui să existe 11 elemente <p>, dar s-au găsit " + pElements.length + "." };
  }

  // Pick a number to test
  const testNumber = 8;
  input.value = String(testNumber);

  // Call the user's search function
  if (typeof window.gaseste !== "function") {
    return { pass: false, message: "❌ Funcția gaseste() nu este definită." };
  }
  window.gaseste();

  const highlighted = pElements.find(p => p.style.backgroundColor === "darkred");
  if (!highlighted) {
    return { pass: false, message: "❌ Niciun pătrat nu a fost evidențiat." };
  }

  if (highlighted.textContent !== String(testNumber)) {
    return { pass: false, message: "❌ Pătratul evidențiat nu corespunde numărului introdus. Așteptat: " + testNumber + ", găsit: " + highlighted.textContent };
  }

  return { pass: true, message: "✅ Corect! Pătratul potrivit a fost evidențiat." };
}
