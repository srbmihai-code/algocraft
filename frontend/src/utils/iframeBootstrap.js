window.onerror = function (msg, url, line, col, err) {
  window.parent.postMessage({ type: "runtime-error", message: msg, line }, "*");
};

try {
  window.addEventListener("message", (e) => {
    if (e.data?.type === "run-test" && window.runTestFromParent) {
      try {
        const result = window.runTestFromParent();
        window.parent.postMessage({ type: "test-result", result }, "*");
      } catch (err) {
        window.parent.postMessage(
          {
            type: "runtime-error",
            message: err.message || err,
            line: err.lineNumber || 1,
          },
          "*"
        );
      }
    }
  });
} catch (err) {
  window.parent.postMessage(
    { type: "runtime-error", message: err.message || err, line: err.lineNumber || 1 },
    "*"
  );
}
