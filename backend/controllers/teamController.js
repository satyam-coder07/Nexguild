const Team = require('../models/Team');

// Get all teams
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('leader', 'name email avatar')
            .populate('members', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new team
exports.createTeam = async (req, res) => {
    try {
        const team = new Team({
            name: req.body.name,
            description: req.body.description,
            leader: req.user.id,
            members: [req.user.id],
            lookingFor: req.body.lookingFor,
            rank: req.body.rank || 'Unranked'
        });

        const newTeam = await team.save();
        const populatedTeam = await Team.findById(newTeam._id)
            .populate('leader', 'name email avatar')
            .populate('members', 'name email avatar');
        res.status(201).json(populatedTeam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a team
exports.updateTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is the leader
        if (team.leader.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this team' });
        }

        team.name = req.body.name || team.name;
        team.description = req.body.description || team.description;
        team.lookingFor = req.body.lookingFor || team.lookingFor;
        team.rank = req.body.rank || team.rank;

        const updatedTeam = await team.save();
        const populatedTeam = await Team.findById(updatedTeam._id)
            .populate('leader', 'name email avatar')
            .populate('members', 'name email avatar');
        res.json(populatedTeam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a team
exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is the leader
        if (team.leader.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this team' });
        }

        await Team.findByIdAndDelete(req.params.id);
        res.json({ message: 'Team deleted successfully', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add member to team
exports.addMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is the leader
        if (team.leader.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add members' });
        }

        if (!team.members.includes(req.body.userId)) {
            team.members.push(req.body.userId);
            await team.save();
        }

        const populatedTeam = await Team.findById(team._id)
            .populate('leader', 'name email avatar')
            .populate('members', 'name email avatar');
        res.json(populatedTeam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Remove member from team
exports.removeMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is the leader
        if (team.leader.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to remove members' });
        }

        team.members = team.members.filter(
            member => member.toString() !== req.params.userId
        );
        await team.save();

        const populatedTeam = await Team.findById(team._id)
            .populate('leader', 'name email avatar')
            .populate('members', 'name email avatar');
        res.json(populatedTeam);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
