import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ────────────────────────────────────────────
   Custom component renderers for ReactMarkdown
   ──────────────────────────────────────────── */
const createComponents = (isAssistant, navigate) => ({
    // Ordered lists
    ol: ({ children, ...props }) => (
        <ol className="list-decimal ml-5 my-3 space-y-2 text-chat-text-primary/90 text-sm" {...props}>
            {children}
        </ol>
    ),

    // Unordered lists
    ul: ({ children, ...props }) => (
        <ul className="list-disc ml-5 my-3 space-y-2 text-chat-text-primary/90 text-sm" {...props}>
            {children}
        </ul>
    ),

    // List items
    li: ({ children, ...props }) => (
        <li className="pl-1 leading-relaxed" {...props}>
            {children}
        </li>
    ),

    // Paragraphs
    p: ({ children, ...props }) => (
        <p className="leading-relaxed mb-3 last:mb-0 text-sm" {...props}>
            {children}
        </p>
    ),

    // Bold text
    strong: ({ children, ...props }) => (
        <strong className="font-black text-chat-accent" {...props}>
            {children}
        </strong>
    ),

    // Italic / emphasis
    em: ({ children, ...props }) => (
        <em className="text-chat-text-secondary/90 italic" {...props}>
            {children}
        </em>
    ),

    // Headings
    h1: ({ children, ...props }) => (
        <h1 className="text-lg font-black tracking-tight text-chat-text-primary mt-4 mb-2" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }) => (
        <h2 className="text-base font-black tracking-tight text-chat-text-primary mt-3 mb-2" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }) => (
        <h3 className="text-sm font-bold tracking-tight text-chat-text-primary mt-2 mb-1.5" {...props}>{children}</h3>
    ),
    h4: ({ children, ...props }) => (
        <h4 className="text-xs font-bold uppercase tracking-wider text-chat-text-secondary mb-1" {...props}>{children}</h4>
    ),

    // Code
    code: ({ inline, children, ...props }) => {
        if (inline) {
            return (
                <code className="text-chat-accent bg-chat-accent/10 px-1.5 py-0.5 rounded-md font-mono text-xs" {...props}>
                    {children}
                </code>
            );
        }
        return (
            <pre className="rounded-xl bg-black/20 border border-chat-border p-3 overflow-x-auto mb-3">
                <code className="text-xs font-mono text-chat-text-primary" {...props}>
                    {children}
                </code>
            </pre>
        );
    },

    // Blockquotes
    blockquote: ({ children, ...props }) => (
        <blockquote className="border-l-3 border-chat-accent pl-3 my-2 text-chat-text-secondary italic text-sm bg-chat-card/30 py-2 rounded-r-lg" {...props}>
            {children}
        </blockquote>
    ),

    // Tables
    table: ({ children, ...props }) => (
        <div className="overflow-x-auto rounded-xl border border-chat-border mb-2 shadow-sm">
            <table className="w-full border-collapse text-xs" {...props}>
                {children}
            </table>
        </div>
    ),
    th: ({ children, ...props }) => (
        <th className="border-b border-chat-border bg-chat-card px-2 py-1.5 text-left text-[10px] uppercase tracking-wider font-bold text-chat-text-secondary" {...props}>
            {children}
        </th>
    ),
    td: ({ children, ...props }) => (
        <td className="border-b border-chat-border/50 px-2 py-1.5 text-xs text-chat-text-primary/90" {...props}>
            {children}
        </td>
    ),

    // Links — internal (/assets/...) use navigate, external open in new tab
    a: ({ children, href, ...props }) => {
        const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
        if (isInternal) {
            return (
                <span
                    role="link"
                    onClick={(e) => { e.stopPropagation(); navigate(href); }}
                    className="text-chat-accent hover:text-chat-accent/80 underline decoration-chat-accent/30 hover:decoration-chat-accent font-medium cursor-pointer transition-colors"
                    {...props}
                >
                    {children}
                </span>
            );
        }
        return (
            <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-chat-accent hover:text-chat-accent/80 underline decoration-chat-accent/30 hover:decoration-chat-accent font-medium transition-colors" 
                {...props}
            >
                {children}
            </a>
        );
    },

    // Horizontal rule
    hr: () => (
        <hr className="my-4 border-t border-chat-border/60" />
    ),
});

const MessageContent = ({ content, isAssistant }) => {
    const navigate = useNavigate();
    const components = createComponents(isAssistant, navigate);

    return (
        <div className={`max-w-none break-words ${isAssistant ? '' : 'text-white/95'} selection:bg-chat-accent/30`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MessageContent;
