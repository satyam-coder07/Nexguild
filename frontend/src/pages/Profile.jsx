import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Edit2, Github, Linkedin, Mail, MapPin, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
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
                            <button className="btn-secondary flex items-center gap-2">
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
        </div>
    );
};

export default Profile;
