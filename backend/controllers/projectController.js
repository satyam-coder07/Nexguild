const Project = require('../models/Project');

// Get all projects with search
exports.getProjects = async (req, res) => {
    try {
        const { search } = req.query;
        const query = search ? { $text: { $search: search } } : {};

        const projects = await Project.find(query)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const project = new Project({
            owner: req.user.id,
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags || [],
            link: req.body.link,
            image: req.body.image,
            status: req.body.status || 'Building',
            members: [req.user.id]
        });

        const newProject = await project.save();
        const populatedProject = await Project.findById(newProject._id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');
        res.status(201).json(populatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.tags = req.body.tags || project.tags;
        project.link = req.body.link || project.link;
        project.image = req.body.image || project.image;
        project.status = req.body.status || project.status;

        const updatedProject = await project.save();
        const populatedProject = await Project.findById(updatedProject._id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');
        res.json(populatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add member to project
exports.addMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add members' });
        }

        if (!project.members.includes(req.body.userId)) {
            project.members.push(req.body.userId);
            await project.save();
        }

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');
        res.json(populatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Remove member from project
exports.removeMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to remove members' });
        }

        project.members = project.members.filter(
            member => member.toString() !== req.params.userId
        );
        await project.save();

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');
        res.json(populatedProject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
