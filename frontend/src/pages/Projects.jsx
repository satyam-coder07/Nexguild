import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ExternalLink, X, Search, Edit2, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        link: '',
        status: 'active'
    });

    useEffect(() => {
        fetchProjects();
    }, [searchQuery]);

    const fetchProjects = async () => {
        try {
            const res = await api.get(`api/projects${searchQuery ? `?search=${searchQuery}` : ''}`);
            setProjects(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load projects');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            const data = { ...formData, tags: tagsArray };

            if (editingProject) {
                const res = await api.put(`/projects/${editingProject}`, data);
                setProjects(projects.map(p => p._id === editingProject ? res.data : p));
                toast.success('Updated!');
            } else {
                const res = await api.post('/projects', data);
                setProjects([res.data, ...projects]);
                toast.success('Created!');
            }

            setShowModal(false);
            setEditingProject(null);
            setFormData({ title: '', description: '', tags: '', link: '', status: 'active' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project._id);
        setFormData({
            title: project.title,
            description: project.description,
            tags: project.tags.join(', '),
            link: project.link || '',
            status: project.status
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
            toast.success('Deleted!');
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-100">Projects</h1>
                    <p className="text-sm text-gray-500 mt-1">Showcase your work</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full bg-dark-800 border-dark-700 rounded-lg py-2 pl-10 pr-4 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingProject(null);
                            setFormData({ title: '', description: '', tags: '', link: '', status: 'active' });
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>New</span>
                    </button>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-4xl mb-3">📁</div>
                    <p className="text-gray-500 text-sm">No projects found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={project._id}
                            className="card p-4 group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-base font-semibold text-gray-100 group-hover:text-accent-blue transition">{project.title}</h3>
                                {user?.id === project.owner?._id && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="icon-btn"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="icon-btn text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {project.tags?.slice(0, 3).map(tag => (
                                    <span key={tag} className="badge badge-blue text-xs">
                                        {tag}
                                    </span>
                                ))}
                                {project.tags?.length > 3 && (
                                    <span className="badge badge-gray text-xs">
                                        +{project.tags.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-dark-700">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Users size={14} />
                                    <span>{project.members?.length || 0}</span>
                                </div>
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="icon-btn text-accent-blue hover:text-accent-blue/80"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
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
                                    {editingProject ? 'Edit Project' : 'New Project'}
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
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="React, Node.js, MongoDB"
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Link (optional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/..."
                                        className="w-full bg-dark-800 border-dark-700 rounded-lg p-2.5 text-sm"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full">
                                    {editingProject ? 'Update' : 'Create'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
