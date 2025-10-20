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
      </head>
      <body>
        ${htmlCode}
        <script>${bootstrapScript}</script>
        ${jsCode ? `<script>${jsCode}</script>` : ""}
        ${
          TestFuncCode
            ? `<script>window.runTestFromParent = ${TestFuncCode};</script>`
            : ""
        }
      </body>
    </html>
  `;
  return new Blob([html], { type: "text/html" });
}
