import { linter } from "@codemirror/lint";
import { parse } from "acorn";

const syntaxLinter = linter((view) => {
  const code = view.state.doc.toString();
  try {
    parse(code, { ecmaVersion: 2020 });
    return [];
  } catch (err: any) {
    return [{ from: 0, to: view.state.doc.length, severity: "error", message: err.message }];
  }
});

export default syntaxLinter;
