const express = require('express');
const router = express.Router();
const { getTeams, createTeam, updateTeam, deleteTeam, addMember, removeMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTeams);
router.post('/', protect, createTeam);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;
