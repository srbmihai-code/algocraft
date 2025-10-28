import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function MarkdownWithSpoilers({ content }: { content: string }) {
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
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
