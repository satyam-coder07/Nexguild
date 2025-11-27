import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser, setToken } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            toast.error('Authentication failed. Please try again.');
            navigate('/login');
            return;
        }

        if (token) {
            // Store token
            localStorage.setItem('token', token);
            setToken(token); // Update context token

            // Decode token to get user info (simple decode, not verification)
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decoded = JSON.parse(jsonPayload);
                setUser({ id: decoded.id, email: decoded.email });

                toast.success('Successfully logged in!');
                navigate('/');
            } catch (err) {
                console.error('Token decode error:', err);
                toast.error('Authentication error');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, setUser, setToken]);

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center">
            <div className="text-center">
                <div className="loading-dots mb-4">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p className="text-gray-400 text-sm">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
