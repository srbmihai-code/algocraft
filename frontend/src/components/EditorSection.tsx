import { useEffect, useState } from "react";
import { CodeEditor } from "./CodeEditor";

interface EditorSectionProps {
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
  setHtmlCode: (value: string) => void;
  setCssCode: (value: string) => void;
  setJsCode: (value: string) => void;
  onRun: () => void;
  runLabel: string;
}

export function EditorSection({
  htmlCode,
  cssCode,
  jsCode,
  setHtmlCode,
  setCssCode,
  setJsCode,
  onRun,
  runLabel,
}: EditorSectionProps) {
  const tabs = [
    { label: "index.html", value: "html", code: htmlCode, setter: setHtmlCode },
    { label: "style.css", value: "css", code: cssCode, setter: setCssCode },
    { label: "index.js", value: "js", code: jsCode, setter: setJsCode },
  ].filter(tab => tab.code !== undefined);

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const hasHtml = htmlCode !== undefined;
  const hasCss = cssCode !== undefined;
  const hasJs = jsCode !== undefined;

  useEffect(() => {
    if (
      activeTab === "html" && hasHtml ||
      activeTab === "css" && hasCss ||
      activeTab === "js" && hasJs
    ) {
      return;
    }

    if (hasJs) setActiveTab("js");
    else if (hasCss) setActiveTab("css");
    else if (hasHtml) setActiveTab("html");
  }, [activeTab, hasHtml, hasCss, hasJs]);

  const currentTab = tabs.find(tab => tab.value === activeTab);

  if (!currentTab) return null;

  return (
    <div className="editor-shell">
      <div className="editor-tabs">
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`tab-btn ${tab.value === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="editor-content">
        <CodeEditor
          title={currentTab.label}
          value={currentTab.code!}
          onChange={currentTab.setter}
        />
      </div>

      <div className="editor-footer">
        <button className="editor-run-btn" onClick={onRun}>
          {runLabel}
        </button>
      </div>
    </div>
  );
}
