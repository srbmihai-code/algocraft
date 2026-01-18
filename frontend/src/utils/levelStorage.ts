export function saveLevelCode(
  chapterName: string,
  levelURL: string,
  html: string,
  css: string,
  js: string
) {
  localStorage.setItem(
    `level_${chapterName}_${levelURL}`,
    JSON.stringify({ html, css, js })
  );
}

export function loadLevelCode(
  chapterName: string,
  levelURL: string
): { html: string; css: string; js: string } | null {
  const raw = localStorage.getItem(`level_${chapterName}_${levelURL}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearLevelCode(chapterName: string, levelURL: string) {
  localStorage.removeItem(`level_${chapterName}_${levelURL}`);
}
