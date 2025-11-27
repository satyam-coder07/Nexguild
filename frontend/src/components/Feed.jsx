import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { MessageCircle, Heart, MoreHorizontal, Edit2, Trash2, Send, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Feed = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [commentingOn, setCommentingOn] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [showMenu, setShowMenu] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data.posts);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            const res = await api.post('/posts', { content: newPost });
            setPosts([res.data, ...posts]);
            setNewPost('');
            toast.success('Posted successfully!');
        } catch (err) {
            toast.error('Failed to create post');
        }
    };

    const handleUpdatePost = async (postId) => {
        if (!editContent.trim()) return;

        try {
            const res = await api.put(`/posts/${postId}`, { content: editContent });
            setPosts(posts.map(p => p._id === postId ? res.data : p));
            setEditingPost(null);
            setEditContent('');
            toast.success('Post updated!');
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Delete this post? This action cannot be undone.')) return;

        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success('Post deleted');
            setShowMenu(null);
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleLike = async (id) => {
        try {
            const res = await api.put(`/posts/${id}/like`);
            setPosts(posts.map(p => p._id === id ? res.data : p));
        } catch (err) {
            toast.error('Failed to like');
        }
    };

    const handleAddComment = async (postId) => {
        if (!commentText.trim()) return;

        try {
            const res = await api.post(`/posts/${postId}/comments`, { text: commentText });
            setPosts(posts.map(p => p._id === postId ? res.data : p));
            setCommentText('');
            toast.success('Comment added!');
        } catch (err) {
            toast.error('Failed to comment');
        }
    };

    const getTimeAgo = (date) => {
        if (!date) return 'just now';
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Create Post Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 bg-dark-800 border border-dark-700 rounded-2xl"
            >
                <div className="flex gap-4">
                    <div className="w-12 h-12 avatar bg-dark-700 text-brand-primary flex-shrink-0 border border-dark-600">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="w-full bg-transparent border-none focus:ring-0 text-base placeholder-gray-600 resize-none p-0"
                            placeholder="What's happening?"
                            rows="2"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-dark-700">
                            <span className="text-xs text-gray-500 font-medium">
                                {newPost.length > 0 && `${newPost.length} characters`}
                            </span>
                            <button
                                onClick={handleCreatePost}
                                disabled={!newPost.trim()}
                                className="btn-primary px-6 py-2.5 rounded-xl text-sm shadow-glow disabled:shadow-none"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Posts Feed */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 font-medium">Loading feed...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>
                    <p className="text-lg font-medium text-white">No posts yet</p>
                    <p className="text-sm mt-1">Be the first to share something with the community!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={post._id}
                            className="card p-6 bg-dark-800 border border-dark-700 rounded-2xl hover:border-dark-600 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 avatar bg-dark-700 text-brand-primary border border-dark-600">
                                        {post.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-base">
                                            {post.user?.name || 'Anonymous'}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                                            {getTimeAgo(post.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {user?.id === post.user?._id && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMenu(showMenu === post._id ? null : post._id)}
                                            className="icon-btn hover:bg-dark-700 text-gray-500 hover:text-white"
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>

                                        <AnimatePresence>
                                            {showMenu === post._id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 mt-2 w-40 bg-dark-800 border border-dark-700 rounded-xl shadow-soft z-10 overflow-hidden p-1"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setEditingPost(post._id);
                                                            setEditContent(post.content);
                                                            setShowMenu(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                        Edit Post
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePost(post._id)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {editingPost === post._id ? (
                                <div className="mb-4">
                                    <textarea
                                        className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-base resize-none focus:border-brand-primary transition-colors"
                                        rows="4"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-3 mt-3 justify-end">
                                        <button
                                            onClick={() => {
                                                setEditingPost(null);
                                                setEditContent('');
                                            }}
                                            className="btn-secondary px-4 py-2 text-sm rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleUpdatePost(post._id)}
                                            className="btn-primary px-4 py-2 text-sm rounded-lg"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-200 mb-4 text-base leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </p>
                            )}

                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="badge badge-primary text-xs px-3 py-1 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-6 text-gray-500 pt-4 border-t border-dark-700">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleLike(post._id)}
                                    className={`flex items-center gap-2 hover:text-brand-primary transition-colors group ${post.likes?.includes(user?.id) ? 'text-brand-primary' : ''
                                        }`}
                                >
                                    <Heart
                                        size={20}
                                        className={post.likes?.includes(user?.id) ? "fill-current" : "group-hover:stroke-brand-primary"}
                                    />
                                    <span className="text-sm font-medium">
                                        {post.likes?.length || 0}
                                    </span>
                                </motion.button>

                                <button
                                    onClick={() => setCommentingOn(commentingOn === post._id ? null : post._id)}
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                                >
                                    <MessageCircle size={20} />
                                    <span className="text-sm font-medium">
                                        {post.comments?.length || 0}
                                    </span>
                                </button>

                                <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            {/* Comments Section */}
                            <AnimatePresence>
                                {commentingOn === post._id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 pt-4 border-t border-dark-700 overflow-hidden"
                                    >
                                        <div className="flex gap-3 mb-4">
                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                className="flex-1 bg-dark-900 border-dark-600 rounded-xl px-4 py-2.5 text-sm focus:border-brand-primary transition-colors"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleAddComment(post._id);
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddComment(post._id)}
                                                className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-black hover:bg-brand-secondary transition-colors"
                                                disabled={!commentText.trim()}
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>

                                        {post.comments && post.comments.length > 0 && (
                                            <div className="space-y-3">
                                                {post.comments.map((comment, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex gap-3 bg-dark-900/50 p-3 rounded-xl"
                                                    >
                                                        <div className="w-8 h-8 avatar bg-dark-800 text-xs flex-shrink-0 border border-dark-700">
                                                            {comment.user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-baseline">
                                                                <p className="font-semibold text-xs text-white">
                                                                    {comment.user?.name || 'Anonymous'}
                                                                </p>
                                                                <span className="text-[10px] text-gray-600">
                                                                    {getTimeAgo(comment.createdAt)}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-400 text-sm mt-1">
                                                                {comment.text}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Feed;
