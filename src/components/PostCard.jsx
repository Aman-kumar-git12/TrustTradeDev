import React from 'react';
import { Heart, MessageSquare, Repeat, Share, MoreHorizontal, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    // Basic mock post structure if nothing passed
    const p = post || {
        author: {
            name: " नेहा2G Rao",
            avatar: "N2",
            badgeColor: "bg-teal-400",
        },
        timeAgo: "4 months ago",
        privacy: "Public",
        content: "Just shipped a feature I've been working on for 3 weeks. The feeling when it finally works is indescribable. Late nights, debugging sessions, coffee cups — all worth it. Build things that matter. ✨",
        hashtags: ["#buildinpublic", "#shipping", "#devlife"],
        media: null, // e.g. { type: 'image', url: '...' }
        likes: 89,
        comments: 11,
        reposts: 34
    };

    return (
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 mb-6 hover:border-white/10 transition-colors shadow-lg shadow-black/50">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <Link to="/profile" className="cursor-pointer">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg ${p.author.badgeColor || 'bg-gradient-to-br from-pink-500 to-purple-500'}`}>
                            {p.author.avatar}
                        </div>
                    </Link>
                    <div>
                        <Link to="/profile" className="text-white font-bold text-[15px] hover:underline decoration-white/30 block mb-0.5">
                            {p.author.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span>{p.timeAgo}</span>
                            <span>&middot;</span>
                            {p.privacy === 'Public' ? <Globe className="w-3 h-3 text-blue-400" /> : <Lock className="w-3 h-3 text-yellow-500" />}
                            <span className={p.privacy === 'Public' ? "text-blue-400 font-medium" : "text-yellow-500 font-medium"}>{p.privacy}</span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content Text */}
            <p className="text-[#e0e0e0] text-[15px] leading-relaxed mb-4 whitespace-pre-line">
                {p.content}
            </p>

            {/* Media (if any) */}
            {p.media && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-white/5 bg-[#1a1525] flex items-center justify-center min-h-[300px]">
                    {p.media.type === 'emoji' ? (
                        <div className="text-center p-12">
                            <div className="text-8xl mb-4 drop-shadow-2xl">{p.media.content}</div>
                            <p className="text-gray-400 text-sm font-medium">{p.media.caption}</p>
                        </div>
                    ) : (
                        <img src={p.media.url} alt="Post media" className="w-full h-auto object-cover max-h-[500px]" />
                    )}
                </div>
            )}

            {/* Hashtags */}
            {p.hashtags && p.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {p.hashtags.map((tag, idx) => (
                        <Link key={idx} to={`/hashtag/${tag.replace('#', '')}`} className="px-3 py-1 bg-white/5 border border-purple-500/20 text-purple-300 text-[13px] font-medium rounded-full hover:bg-white/10 hover:border-purple-500/40 transition-colors cursor-pointer">
                            {tag}
                        </Link>
                    ))}
                </div>
            )}

            {/* Engagement Row */}
            <div className="flex items-center justify-between text-gray-500 pt-2 px-1">
                <div className="flex items-center gap-8">
                    <button className="flex items-center gap-2 hover:text-pink-500 transition-colors group">
                        <Heart className="w-5 h-5 group-active:scale-90 transition-transform stroke-2" />
                        <span className="text-sm font-medium">{p.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                        <MessageSquare className="w-5 h-5 group-active:scale-90 transition-transform stroke-2" />
                        <span className="text-sm font-medium">{p.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-emerald-400 transition-colors group">
                        <Repeat className="w-5 h-5 group-active:scale-90 transition-transform stroke-2" />
                        <span className="text-sm font-medium">{p.reposts}</span>
                    </button>
                </div>
                <button className="flex items-center gap-2 hover:text-white transition-colors group">
                    <Share className="w-5 h-5 group-active:scale-90 transition-transform stroke-2" />
                    <span className="text-sm font-medium hidden sm:inline">Share</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
