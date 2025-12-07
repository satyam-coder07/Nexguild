const Post = require('../models/Post');

// Get all posts with pagination and filtering
exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, tag } = req.query;
        const query = tag ? { tags: tag } : {};

        const posts = await Post.find(query)
            .populate('user', 'name email avatar')
            .populate('comments.user', 'name email avatar')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Post.countDocuments(query);

        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const post = new Post({
            user: req.user.id,
            content: req.body.content,
            image: req.body.image,
            tags: req.body.tags || []
        });
        const newPost = await post.save();
        const populatedPost = await Post.findById(newPost._id)
            .populate('user', 'name email avatar')
            .populate('comments.user', 'name email avatar');
        res.status(201).json(populatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        post.content = req.body.content || post.content;
        post.image = req.body.image || post.image;
        post.tags = req.body.tags || post.tags;

        const updatedPost = await post.save();
        const populatedPost = await Post.findById(updatedPost._id)
            .populate('user', 'name email avatar')
            .populate('comments.user', 'name email avatar');
        res.json(populatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Like/Unlike a post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(req.user.id);
        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();
        const populatedPost = await Post.findById(post._id)
            .populate('user', 'name email avatar')
            .populate('comments.user', 'name email avatar');
        res.json(populatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add comment to post
exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user.id,
            text: req.body.text,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate('user', 'name email avatar')
            .populate('comments.user', 'name email avatar');
        res.json(populatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete comment from post
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user owns the comment or the post
        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        comment.remove();
        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate('user', 'name email avatar')
            .populate('comments.user', 'name email avatar');
        res.json(populatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
