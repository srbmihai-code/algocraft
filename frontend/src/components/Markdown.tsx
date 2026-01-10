import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Markdown({ content }: { content: string }) {
  const processedContent = content.replace(/@@(.*?)@@/gs, (_match, p1) => {
    return `<span class="spoiler">${p1}</span>`;
  });
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
            <code className="cod">
              {children}
            </code>
          );
        },
      }}
    >
      {processedContent}
    </ReactMarkdown>

  );
}
