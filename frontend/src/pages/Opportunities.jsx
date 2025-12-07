import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Plus, X, Edit2, Trash2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Opportunities = () => {
    const { user } = useContext(AuthContext);
    const [opportunities, setOpportunities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingOpp, setEditingOpp] = useState(null);
    const [filter, setFilter] = useState('All');
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        type: 'Job',
        description: '',
        link: '',
        location: ''
    });

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            const res = await api.get('api/opportunities');
            setOpportunities(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load opportunities');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOpp) {
                const res = await api.put(`api/opportunities/${editingOpp}`, formData);
                setOpportunities(opportunities.map(o => o._id === editingOpp ? res.data : o));
                toast.success('Opportunity updated!');
            } else {
                const res = await api.post('api/opportunities', formData);
                setOpportunities([res.data, ...opportunities]);
                toast.success('Opportunity posted!');
            }
            setShowModal(false);
            setEditingOpp(null);
            setFormData({ title: '', company: '', type: 'Job', description: '', link: '', location: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (opp) => {
        setEditingOpp(opp._id);
        setFormData({
            title: opp.title,
            company: opp.company,
            type: opp.type,
            description: opp.description,
            link: opp.link,
            location: opp.location
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this opportunity?')) return;
        try {
            await api.delete(`api/opportunities/${id}`);
            setOpportunities(opportunities.filter(o => o._id !== id));
            toast.success('Opportunity deleted!');
        } catch (err) {
            toast.error('Failed to delete opportunity');
        }
    };

    const filteredOpportunities = filter === 'All'
        ? opportunities
        : opportunities.filter(opp => opp.type === filter);

    const getTypeBadge = (type) => {
        const badges = {
            Job: 'badge-cyan',
            Internship: 'badge-blue',
            Hackathon: 'badge-purple'
        };
        return badges[type] || 'badge-gray';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-100">Opportunities</h1>
                    <p className="text-sm text-gray-500 mt-1">Discover your next career move</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-dark-800 border-dark-700 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="All">All Types</option>
                        <option value="Job">Jobs</option>
                        <option value="Internship">Internships</option>
                        <option value="Hackathon">Hackathons</option>
                    </select>
                    <button
                        onClick={() => {
                            setEditingOpp(null);
                            setFormData({ title: '', company: '', type: 'Job', description: '', link: '', location: '' });
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Post</span>
                    </button>
                </div>
            </div>

            {filteredOpportunities.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-4xl mb-3">💼</div>
                    <p className="text-gray-500 text-sm">No opportunities found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredOpportunities.map((opp, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={opp._id}
                            className="card p-4 flex flex-col md:flex-row justify-between items-start gap-4"
                        >
                            <div className="flex-1 w-full">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center">
                                            <Building2 className="text-accent-blue" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-100">{opp.title}</h3>
                                            <p className="text-accent-purple text-sm font-medium">{opp.company}</p>
                                        </div>
                                    </div>
                                    {(user?._id === (opp.poster?._id || opp.poster)) && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleEdit(opp)}
                                                className="icon-btn"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(opp._id)}
                                                className="icon-btn text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-400 text-sm mb-3">{opp.description}</p>

                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className={`badge ${getTypeBadge(opp.type)} text-xs`}>
                                        {opp.type}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                                        <MapPin size={12} />
                                        {opp.location}
                                    </span>
                                </div>
                            </div>

                            <a
                                href={opp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary whitespace-nowrap self-start md:self-center"
                            >
                                Apply Now
                            </a>
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
                            className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border-dark-600"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-semibold text-gray-100">
                                    {editingOpp ? 'Edit Opportunity' : 'Post Opportunity'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="icon-btn">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Company</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Type</label>
                                    <select
                                        required
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Job">Job</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Hackathon">Hackathon</option>
                                    </select>
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
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Remote, New York, etc."
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Application Link</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://..."
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full">
                                    {editingOpp ? 'Update' : 'Post'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Opportunities;
