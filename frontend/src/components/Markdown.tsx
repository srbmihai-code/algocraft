import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      skipHtml={false}
      components={{
        span: ({ className, children }) => {
          if (className?.includes("spoiler")) {
            return <span className="spoiler">{children}</span>;
          }
          return <span className={className}>{children}</span>;
        },
        code: ({ children }) => {
          return (
            <code
              style={{
                backgroundColor: "#f1f3f5",
                borderRadius: "6px",
                fontSize: "0.9em",
                fontFamily: "monospace",
              }}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>

  );
}
