import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Github, Linkedin, Mail, MapPin, Award, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        github: '',
        linkedin: '',
        skills: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('api/auth/profile');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const res = await api.put('api/auth/profile', { ...formData, skills: skillsArray });
            setProfile(res.data);
            setShowModal(false);
            toast.success('Profile updated!');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
        try {
            await api.delete('api/auth/profile');
            logout();
            navigate('/login');
            toast.success('Account deleted');
        } catch (err) {
            toast.error('Failed to delete account');
        }
    };

    const openEditModal = () => {
        setFormData({
            name: profile.name || '',
            role: profile.role || '',
            bio: profile.bio || '',
            github: profile.github || '',
            linkedin: profile.linkedin || '',
            skills: profile.skills ? profile.skills.join(', ') : ''
        });
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
            >
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 avatar text-3xl flex-shrink-0">
                        {profile?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-100">{profile?.name}</h1>
                                <p className="text-sm text-gray-500 mt-1">{profile?.role || 'Developer'}</p>
                            </div>
                            <button
                                onClick={openEditModal}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Edit2 size={16} />
                                <span>Edit</span>
                            </button>
                        </div>

                        {profile?.bio && (
                            <p className="text-gray-400 text-sm mb-4">{profile.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Mail size={14} />
                                <span>{profile?.email}</span>
                            </div>
                            {profile?.github && (
                                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent-blue">
                                    <Github size={14} />
                                    <span>GitHub</span>
                                </a>
                            )}
                            {profile?.linkedin && (
                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent-blue">
                                    <Linkedin size={14} />
                                    <span>LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-4 text-center"
                >
                    <div className="text-2xl font-bold text-accent-blue mb-1">{profile?.xp || 0}</div>
                    <div className="text-xs text-gray-500">XP Points</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="card p-4 text-center"
                >
                    <div className="text-2xl font-bold text-accent-purple mb-1">{profile?.badges?.length || 0}</div>
                    <div className="text-xs text-gray-500">Badges</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-4 text-center"
                >
                    <div className="text-2xl font-bold text-accent-cyan mb-1">0</div>
                    <div className="text-xs text-gray-500">Projects</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="card p-4 text-center"
                >
                    <div className="text-2xl font-bold text-gray-300 mb-1">0</div>
                    <div className="text-xs text-gray-500">Teams</div>
                </motion.div>
            </div>

            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                            <span key={index} className="badge badge-blue">
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Badges */}
            {profile?.badges && profile.badges.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="card p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">Badges</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {profile.badges.map((badge, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-dark-800 rounded-lg">
                                <Award size={20} className="text-accent-blue" />
                                <span className="text-sm text-gray-300">{badge}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border-dark-600"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-semibold text-gray-100">Edit Profile</h2>
                                <button onClick={() => setShowModal(false)} className="icon-btn">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
                                    <input
                                        type="text"
                                        placeholder="Full Stack Developer"
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Bio</label>
                                    <textarea
                                        rows="3"
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm resize-none"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="React, Node.js, Python"
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">GitHub URL</label>
                                    <input
                                        type="url"
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full">
                                    Save Changes
                                </button>

                                <div className="pt-4 mt-4 border-t border-dark-700">
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 py-2 transition text-sm"
                                    >
                                        <Trash2 size={16} />
                                        Delete Account
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
