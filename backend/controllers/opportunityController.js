const Opportunity = require('../models/Opportunity');

// Get all opportunities
exports.getOpportunities = async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};

        const opportunities = await Opportunity.find(query)
            .populate('poster', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json(opportunities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new opportunity
exports.createOpportunity = async (req, res) => {
    try {
        const opportunity = new Opportunity({
            poster: req.user.id,
            title: req.body.title,
            company: req.body.company,
            type: req.body.type,
            description: req.body.description,
            link: req.body.link,
            location: req.body.location
        });

        const newOpportunity = await opportunity.save();
        const populatedOpportunity = await Opportunity.findById(newOpportunity._id)
            .populate('poster', 'name email avatar');
        res.status(201).json(populatedOpportunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update an opportunity
exports.updateOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        // Check if user is the poster
        if (opportunity.poster.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this opportunity' });
        }

        opportunity.title = req.body.title || opportunity.title;
        opportunity.company = req.body.company || opportunity.company;
        opportunity.type = req.body.type || opportunity.type;
        opportunity.description = req.body.description || opportunity.description;
        opportunity.link = req.body.link || opportunity.link;
        opportunity.location = req.body.location || opportunity.location;

        const updatedOpportunity = await opportunity.save();
        const populatedOpportunity = await Opportunity.findById(updatedOpportunity._id)
            .populate('poster', 'name email avatar');
        res.json(populatedOpportunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an opportunity
exports.deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        // Check if user is the poster
        if (opportunity.poster.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this opportunity' });
        }

        await Opportunity.findByIdAndDelete(req.params.id);
        res.json({ message: 'Opportunity deleted successfully', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
