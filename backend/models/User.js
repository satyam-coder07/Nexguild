const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String, sparse: true },
    githubId: { type: String, sparse: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    role: { type: String, default: 'Developer' },
    github: { type: String },
    linkedin: { type: String },
    xp: { type: Number, default: 0 },
    badges: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
