import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import {
    Home, MessageSquare, User, Briefcase, Users,
    Code2, LogOut, Search, Bell, Settings, ChevronDown, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const navItems = [
        { icon: Home, label: 'Feed', path: '/' },
        { icon: Code2, label: 'Projects', path: '/projects' },
        { icon: Users, label: 'Teams', path: '/teams' },
        { icon: Briefcase, label: 'Opportunities', path: '/opportunities' },
        { icon: MessageSquare, label: 'Messages', path: '/chat' },
    ];

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    };

    return (
        <div className="min-h-screen bg-dark-950 text-gray-200 flex font-sans">
            {/* Sidebar - Desktop */}
            <aside className="w-64 fixed h-screen bg-dark-900 border-r border-dark-800 hidden md:flex flex-col z-20">
                {/* Logo */}
                <div className="p-6 mb-2">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/logo.png" alt="NexGuild" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">NexGuild</h1>
                            <p className="text-[11px] text-gray-500 font-medium">Socialwork</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    <p className="px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4 mt-2">Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium relative group ${isActive
                                        ? 'text-white bg-dark-800'
                                        : 'text-gray-500 hover:text-white hover:bg-dark-800/50'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-brand-primary rounded-r-full"
                                        />
                                    )}
                                    <Icon size={20} className={isActive ? 'text-brand-primary' : 'group-hover:text-white transition-colors'} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="p-4 border-t border-dark-800">
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800 transition border border-transparent hover:border-dark-700"
                        >
                            <div className="w-10 h-10 avatar bg-dark-800 border-dark-700 text-brand-primary">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 overflow-hidden text-left">
                                <h4 className="font-semibold text-sm truncate text-white">
                                    {user?.name || 'User'}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">@{user?.name?.toLowerCase().replace(/\s/g, '') || 'username'}</p>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-gray-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full left-0 right-0 mb-3 bg-dark-800 border border-dark-700 rounded-xl shadow-soft overflow-hidden p-1"
                                >
                                    <Link
                                        to="/profile"
                                        onClick={() => setShowProfileMenu(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors"
                                    >
                                        <User size={16} />
                                        Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setShowProfileMenu(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </Link>
                                    <div className="h-px bg-dark-700 my-1 mx-2"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Log Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </aside>

            {/* Mobile Nav (Bottom) */}
            <div className="md:hidden fixed bottom-0 w-full bg-dark-900/90 backdrop-blur-xl border-t border-dark-800 z-50 px-6 py-4 flex justify-between items-center safe-area-bottom">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <div
                                className={`p-3 rounded-xl transition-all ${isActive ? 'text-brand-primary bg-brand-primary/10' : 'text-gray-500'
                                    }`}
                            >
                                <Icon size={24} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen bg-dark-950 relative">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-md px-8 py-5 flex justify-between items-center border-b border-transparent">
                    <div className="flex items-center gap-4 w-full max-w-md">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-dark-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-3 w-2 h-2 bg-brand-primary rounded-full border-2 border-dark-800"></span>
                        </button>

                        <button className="hidden md:flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-black px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-glow">
                            <Plus size={18} />
                            <span>Add New</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 max-w-7xl mx-auto pb-24 md:pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
