import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageContent = ({ content, isAssistant }) => {
    return (
        <div className={`prose prose-sm max-w-none break-words ${isAssistant ? 'prose-slate' : 'prose-invert'} 
            prose-p:leading-relaxed prose-p:mb-3 last:prose-p:mb-0
            prose-headings:text-chat-text-primary prose-headings:font-black prose-headings:tracking-tight prose-headings:mb-2
            prose-strong:text-chat-accent prose-strong:font-black
            prose-ul:list-disc prose-ul:ml-4 prose-ul:mb-3
            prose-ol:list-decimal prose-ol:ml-4 prose-ol:mb-3
            prose-li:text-chat-text-primary/90 prose-li:mb-1
            prose-code:text-chat-accent prose-code:bg-chat-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-table:border-collapse prose-table:w-full prose-table:mb-4
            prose-th:border prose-th:border-chat-border prose-th:bg-chat-card prose-th:p-2 prose-th:text-left prose-th:text-[10px] prose-th:uppercase prose-th:tracking-widest
            prose-td:border prose-td:border-chat-border prose-td:p-2 prose-td:text-xs
            prose-blockquote:border-l-4 prose-blockquote:border-chat-accent prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-chat-text-secondary
            selection:bg-chat-accent/30
        `}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MessageContent;
