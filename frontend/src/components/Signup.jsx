import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-2xl w-full max-w-md"
            >
                <h2 className="text-3xl font-bold gradient-text mb-6 text-center">Join NexGuild</h2>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition shadow-lg shadow-primary/25">
                        Create Account
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
