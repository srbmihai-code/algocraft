import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import retypeRaw from "rehype-raw";
import retypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./Markdown.css"
export default function Markdown({ content }: { content: string }) {
  const processedContent = content.replace(/@@(.*?)@@/gs, (_match, p1) => {
    return `<span class="spoiler">${p1}</span>`;
  });

  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[retypeRaw, retypeHighlight]}
        skipHtml={false}
        components={{
          span: ({ className, children }) => {
            if (className?.includes("spoiler")) {
              return <span className="spoiler">{children}</span>;
            }
            return <span className={className}>{children}</span>;
          },
          code: ({ className, children }) => {
            return <code className={`cod ${className}`}>{children}</code>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
