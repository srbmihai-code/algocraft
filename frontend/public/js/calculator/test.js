function runTest() {
  const input = document.querySelector(".input-numere");
  if (!input) {
    return { pass: false, message: "❌ Nu există un input cu clasa 'input-numere'." };
  }

  const buttons = Array.from(document.querySelectorAll("button")).filter(b =>
    ["+", "-", "*", "/"].includes(b.textContent)
  );
  if (buttons.length !== 4) {
    return { pass: false, message: "❌ Nu există 4 butoane pentru operații (+, -, *, /)." };
  }

  const result = document.getElementById("result");
  if (!result) {
    return { pass: false, message: "❌ Nu există un element <p> cu id='result'." };
  }
  console.log(result)
  const style = window.getComputedStyle(result);
  console.log(style)
  if (parseInt(style.fontSize) < 45 || style.fontWeight !== "700" && style.fontWeight !== "bold") {
    return { pass: false, message: "❌ Rezultatul trebuie să aibă font-size minim 45px și font-weight bold." };
  }

  result.textContent = "0";
  input.value = "10";
  buttons[0].click();
  const afterAdd = Number(result.textContent);

  input.value = "5";
  buttons[1].click();
  const afterSub = Number(result.textContent);

  input.value = "2";
  buttons[2].click();
  const afterMul = Number(result.textContent);

  input.value = "4";
  buttons[3].click();
  const afterDiv = Number(result.textContent);

  if (afterAdd !== 10 || afterSub !== 5 || afterMul !== 10 || afterDiv !== 2.5) {
    return {
      pass: false,
      message: `❌ Operațiile nu au fost efectuate corect:\n10 + ... = ${afterAdd}\n${afterAdd} - 5 = ${afterSub}\n${afterSub} * 2 = ${afterMul}\n${afterMul} / 4 = ${afterDiv}`
    };
  }

  if (input.value !== "") {
    return { pass: false, message: "❌ Input-ul nu a fost golit după click pe buton." };
  }

  return { pass: true, message: "✅ Corect! Input, butoane, operații și stiluri sunt implementate corect." };
}
