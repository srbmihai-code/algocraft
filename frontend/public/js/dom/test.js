function runTest() {
  const paragraph = document.querySelector("p");

  if (!paragraph) {
    return { pass: false, message: "❌ Nu există niciun element <p> în pagină." };
  }

  if (paragraph.textContent !== "Salut din JavaScript!") {
    return { pass: false, message: "❌ Nu există un <p> cu textul „Salut din JavaScript!”." };
  }

  const fontSize = window.getComputedStyle(paragraph).fontSize;

  if (fontSize === "25px") {
    return { pass: true, message: "✅ Corect! Elementul <p> este creat, adăugat în body și are font-size 25px." };
  } else {
    return { pass: false, message: `❌ Greșit. Font-size trebuia să fie 25px, dar este ${fontSize}.` };
  }
}
