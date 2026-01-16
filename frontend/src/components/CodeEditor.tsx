import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { lintGutter } from "@codemirror/lint";
import syntaxLinter from "../utils/syntaxLinter";

interface CodeEditorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ title, value, onChange }: CodeEditorProps) {
  console.log(title, value);
  return (
    <div className="code-editor-wrapper">
      <CodeMirror
        value={value}
        height="85vh"
        extensions={
          title.endsWith(".html")
            ? [html()]
            : title.endsWith(".css")
              ? [css()]
              : [javascript(), lintGutter(), syntaxLinter]
        }
        onChange={onChange}
        className="custom-codemirror"
      />
    </div>
  );
}
