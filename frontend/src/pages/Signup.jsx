import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(formData.name, formData.email, formData.password);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <img src="/logo.png" alt="NexGuild" className="w-16 h-16 object-contain shadow-glow rounded-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-500 text-sm">Join the NexGuild community today</p>
                </div>

                <div className="card p-8 bg-dark-900 border border-dark-800 shadow-soft">


                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Full Name</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-dark-800 border-dark-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-dark-800 border-dark-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-dark-800 border-dark-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 text-base shadow-glow hover:shadow-glow-lg transition-all"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-primary hover:text-brand-secondary font-semibold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
