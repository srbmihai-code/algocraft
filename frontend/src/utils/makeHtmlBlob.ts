import bootstrapScript from "./iframeBootstrap.js?raw";

export function makeHtmlBlob(
  htmlCode: string,
  cssCode: string,
  jsCode: string,
  TestFuncCode: string | null
): Blob {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${cssCode}</style>

    <script defer>${bootstrapScript}</script>

    ${jsCode ? `<script defer>${jsCode}</script>` : ""}

    ${
      TestFuncCode
        ? `<script defer>window.runTestFromParent = ${TestFuncCode};</script>`
        : ""
    }
  </head>

  <body>
    ${htmlCode}
  </body>
</html>

  `;
  return new Blob([html], { type: "text/html" });
}
