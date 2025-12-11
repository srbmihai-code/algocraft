function runTest() {
  const button = document.querySelector("button");

  if (!button || !(button.textContent === "Adauga" || button.textContent === "Adaugă")) {
    return { pass: false, message: "❌ Nu există un buton cu textul „Adaugă”." };
  }

  const p = document.getElementById("number");

  if (!p) {
    return { pass: false, message: "❌ Nu există un element <p> cu id=\"number\"." };
  }

  const initialValue = Number(p.textContent);

  button.click();
  const newValue = Number(p.textContent);

  if (newValue === initialValue + 1) {
    return { pass: true, message: `✅ Corect! Valoarea a crescut de la ${initialValue} la ${newValue}.` };
  } else {
    return { pass: false, message: `❌ Greșit. Valoarea trebuia să fie ${initialValue + 1}, dar este ${newValue}.` };
  }
}
