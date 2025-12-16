export default function filterOutViteFiles (text: string | undefined | null) {
  if (!text) return "";
  if (text.includes('<script type="module" src="/@vite/client">') || text.includes('<div id="root"></div>')) return "";
  return text;
};

