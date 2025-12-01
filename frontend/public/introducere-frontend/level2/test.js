function runTest() {
  try {
    if (typeof findClosestName !== "function") {
      return { pass: false, message: "❌ findClosestName nu este definită." };
    }

    // Generate 100000 sorted names: name00000 ... name099999
    const names = Array.from({ length: 100000 }, (_, i) => "name" + String(i).padStart(5, "0"));
    const target = "name94230_mid";

    // Linear scan baseline (inefficient O(n))
    function linearScan(names, target) {
      for (let i = 0; i < names.length; i++) {
        if (names[i] > target) return names[i];
      }
      return names[names.length - 1];
    }

    const measureTime = (fn, args, runs = 10) => {
      const times = [];
      for (let i = 0; i < runs; i++) {
        const t0 = performance.now();
        fn(...args);
        const t1 = performance.now();
        times.push(t1 - t0);
      }
      return times.reduce((a, b) => a + b, 0) / times.length;
    };

    const linearAvg = measureTime(linearScan, [names, target], 20);
    const userResult = findClosestName(names, target);
    const userAvg = measureTime(findClosestName, [names, target], 20);
    const expected = linearScan(names, target);
    const isCorrect = userResult === expected;
    const isPerformant = userAvg < linearAvg / 2;

    let message = "";
    if (!isCorrect) {
      message = `❌ Rezultat incorect\nRezultat utilizator: ${userResult}\nRezultat așteptat: ${expected}`;
    } else if (!isPerformant) {
      message += `\n❌ Funcția este prea lentă (nu respectă O(log n))
Timp mediu linear: ${linearAvg.toFixed(3)} ms\nTimp mediu utilizator: ${userAvg.toFixed(3)} ms`;
    } else {
      message = `✅ Corect\nRezultat: ${userResult}`;
      message += `\nTimp mediu linear: ${linearAvg.toFixed(3)} ms\nTimp mediu utilizator: ${userAvg.toFixed(3)} ms`;
    }

    return { pass: isCorrect && isPerformant, message };

  } catch (err) {
    return { pass: false, message: "❌ Eroare în timpul testului: " + err.message };
  }
}
