import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-secondary opacity-20" />

                <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] mb-4">
                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-gray-400" />
                            )}
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                    <p className="text-primary font-medium mb-6">{user?.role || 'Developer'}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-md mx-auto">
                        <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                            <Mail className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-sm font-medium">{user?.email}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                            <Shield className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-400">User ID</p>
                                <p className="text-sm font-medium truncate w-32">{user?._id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
