const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, enum: ['Job', 'Internship', 'Freelance', 'Hackathon'], required: true },
    description: { type: String, required: true },
    link: { type: String },
    location: { type: String, default: 'Remote' }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);
