declare var findClosestName: (names: string[], target: string) => string;

import type { TestResult } from "./types";

export function runTest(): TestResult {
  try {
    // Check if the function exists
    if (typeof findClosestName !== "function") {
      return { pass: false, message: "❌ findClosestName nu este definită." };
    }

    // Generate 1000 sorted names: name0000 ... name0999
    const names = Array.from({ length: 1000 }, (_, i) => "name" + String(i).padStart(4, "0"));
    const target = "name0423_mid";

    function lexicalDistance(a: string, b: string) {
      const min = Math.min(a.length, b.length);
      for (let i = 0; i < min; i++) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) return Math.abs(a.charCodeAt(i) - b.charCodeAt(i));
      }
      return Math.abs(a.length - b.length);
    }

    // Inefficient linear search baseline
    function linearScan(names: string[], target: string) {
      let best = names[0];
      let bestDist = lexicalDistance(best, target);
      for (let i = 1; i < names.length; i++) {
        const d = lexicalDistance(names[i], target);
        if (d < bestDist) {
          bestDist = d;
          best = names[i];
        }
      }
      return best;
    }

    // Measure execution time for a function
    const measureTime = (fn: Function, args: any[], runs = 10) => {
      for (let i = 0; i < 3; i++) fn(...args); // warmup
      const times: number[] = [];
      for (let i = 0; i < runs; i++) {
        const t0 = performance.now();
        fn(...args);
        const t1 = performance.now();
        times.push(t1 - t0);
      }
      return times.reduce((a, b) => a + b, 0) / times.length;
    };

    // Measure linear scan
    const linearAvg = measureTime(linearScan, [names, target], 20);

    // Run user's implementation
    const userResult = findClosestName(names, target);
    const userAvg = measureTime(findClosestName, [names, target], 20);

    // Check if user's function is sufficiently fast (O(log n))
    const passesPerformance = userAvg <= linearAvg / 2;

    // Build the message for the user
    let message = `Timp mediu linear: ${linearAvg.toFixed(3)} ms\nTimp mediu utilizator: ${userAvg.toFixed(3)} ms\n`;
    message += `Rezultat găsit: ${userResult}\n`;
    message += passesPerformance
      ? "✅ A trecut testul de performanță O(log n)"
      : "❌ Nu a trecut testul de performanță (nu este suficient de rapid)";

    return { pass: passesPerformance, message };
  } catch (err: any) {
    return { pass: false, message: "❌ Eroare în timpul testului: " + err.message };
  }
}
