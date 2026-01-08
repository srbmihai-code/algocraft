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

export function CodeEditor({
  title,
  value,
  onChange,
}: CodeEditorProps) {
  return (
    <>
      <h3>{title}</h3>
      <CodeMirror
        value={value}
        height="320px"
        extensions={
          title === "HTML"
            ? [html()]
            : title === "CSS"
              ? [css()]
              : [javascript(), lintGutter(), syntaxLinter]}
        onChange={onChange}
      />
    </>
  );
}
