const express = require('express');
const router = express.Router();
const { getPosts, createPost, updatePost, deletePost, likePost, addComment, deleteComment, updateComment } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPosts);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comments', protect, addComment);
router.put('/:id/comments/:commentId', protect, updateComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
