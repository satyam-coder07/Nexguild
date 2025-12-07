const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lookingFor: [{ type: String }], // e.g., ["Frontend", "DevOps"]
    rank: { type: String, default: 'Bronze' }
}, { timestamps: true });

teamSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Team', teamSchema);
