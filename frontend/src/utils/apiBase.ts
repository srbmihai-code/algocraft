export function getApiBase(): string {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:3001/api";
  } else {
    return "https://algocraft-rlny.onrender.com/api";
  }
}
