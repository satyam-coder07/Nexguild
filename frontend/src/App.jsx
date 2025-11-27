import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Projects from './pages/Projects';
import Teams from './pages/Teams';
import Chat from './pages/Chat';
import Opportunities from './pages/Opportunities';

const AppLayout = ({ children }) => {
    return <Layout>{children}</Layout>;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Toaster position="top-center" toastOptions={{
                    style: {
                        background: '#1E293B',
                        color: '#fff',
                    },
                }} />
                <div className="app font-sans text-gray-900">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />

                        {/* Protected Routes with Layout */}
                        <Route path="/" element={<ProtectedRoute><AppLayout><Feed /></AppLayout></ProtectedRoute>} />
                        <Route path="/projects" element={<ProtectedRoute><AppLayout><Projects /></AppLayout></ProtectedRoute>} />
                        <Route path="/teams" element={<ProtectedRoute><AppLayout><Teams /></AppLayout></ProtectedRoute>} />
                        <Route path="/opportunities" element={<ProtectedRoute><AppLayout><Opportunities /></AppLayout></ProtectedRoute>} />
                        <Route path="/chat" element={<ProtectedRoute><AppLayout><Chat /></AppLayout></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
