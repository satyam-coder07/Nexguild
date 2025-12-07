import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, Plus, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Teams = () => {
    const { user } = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        lookingFor: ''
    });

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await api.get('api/teams');
            setTeams(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load teams');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTeam) {
                const res = await api.put(`api/teams/${editingTeam}`, formData);
                setTeams(teams.map(t => t._id === editingTeam ? res.data : t));
                toast.success('Team updated!');
            } else {
                const res = await api.post('api/teams', formData);
                setTeams([res.data, ...teams]);
                toast.success('Team created!');
            }
            setShowModal(false);
            setEditingTeam(null);
            setFormData({ name: '', description: '', lookingFor: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (team) => {
        setEditingTeam(team._id);
        setFormData({
            name: team.name,
            description: team.description,
            lookingFor: team.lookingFor || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this team?')) return;
        try {
            await api.delete(`api/teams/${id}`);
            setTeams(teams.filter(t => t._id !== id));
            toast.success('Team deleted!');
        } catch (err) {
            toast.error('Failed to delete team');
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center py-8">
                <h1 className="text-2xl font-semibold text-gray-100 mb-2">Teams</h1>
                <p className="text-sm text-gray-500 mb-6">Join forces with talented developers</p>
                <button
                    onClick={() => {
                        setEditingTeam(null);
                        setFormData({ name: '', description: '', lookingFor: '' });
                        setShowModal(true);
                    }}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <Plus size={18} />
                    <span>Create Team</span>
                </button>
            </div>

            {teams.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-4xl mb-3">👥</div>
                    <p className="text-gray-500 text-sm">No teams yet. Create the first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={team._id}
                            className="card p-4"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-12 h-12 avatar text-base">
                                    {team.name.charAt(0)}
                                </div>
                                {user?.id === team.leader?._id && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(team)}
                                            className="icon-btn"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(team._id)}
                                            className="icon-btn text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-base font-semibold text-gray-100 mb-2">{team.name}</h3>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{team.description}</p>

                            {team.lookingFor && (
                                <div className="mb-3">
                                    <span className="text-xs text-gray-500">Looking for:</span>
                                    <p className="text-accent-cyan text-sm font-medium">{team.lookingFor}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 pt-3 border-t border-dark-700">
                                <div className="flex items-center gap-1.5">
                                    <Users size={14} />
                                    <span className="text-xs">{team.members?.length || 0} members</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Trophy size={14} />
                                    <span className="text-xs">{team.rank || 'Unranked'}</span>
                                </div>
                            </div>

                            <button className="w-full py-2 rounded-lg bg-dark-800 border border-dark-700 hover:border-accent-blue hover:bg-dark-800/50 transition text-sm font-medium text-gray-300">
                                Request to Join
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
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
                            className="card p-6 w-full max-w-md border-dark-600"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-semibold text-gray-100">
                                    {editingTeam ? 'Edit Team' : 'Create Team'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="icon-btn">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Team Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Looking For</label>
                                    <input
                                        type="text"
                                        placeholder="Frontend Developer, Designer..."
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.lookingFor}
                                        onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full">
                                    {editingTeam ? 'Update' : 'Create'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Teams;
