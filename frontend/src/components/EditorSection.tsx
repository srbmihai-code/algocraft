import { CodeEditor } from "./CodeEditor";

interface EditorSectionProps {
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
  setHtmlCode: (value: string) => void;
  setCssCode: (value: string) => void;
  setJsCode: (value: string) => void;
}

export function EditorSection({
  htmlCode,
  cssCode,
  jsCode,
  setHtmlCode,
  setCssCode,
  setJsCode,
}: EditorSectionProps) {
  return (
    <>
      {htmlCode !== undefined && (
        <CodeEditor
          title="HTML"
          value={htmlCode}
          onChange={setHtmlCode}
        />
      )}

      {cssCode !== undefined && (
        <CodeEditor
          title="CSS"
          value={cssCode}
          onChange={setCssCode}
        />
      )}

      {jsCode !== undefined && (
        <CodeEditor
          title="JS"
          value={jsCode}
          onChange={setJsCode}
        />
      )}
    </>
  );
}
