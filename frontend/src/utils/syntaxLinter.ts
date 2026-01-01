import { linter } from "@codemirror/lint";
import { parse } from "acorn";

const syntaxLinter = linter((view) => {
  const code = view.state.doc.toString();

  try {
    parse(code, { ecmaVersion: 2020 });
    return [];
  } catch (err: any) {
    const lineNumber = err.loc?.line ?? 1;
    const line = view.state.doc.line(lineNumber);
    return [
      {
        from: line.from,
        to: line.to,
        severity: "error",
        message: err.message,
      },
    ];
  }
});

export default syntaxLinter;
