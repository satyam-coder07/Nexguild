import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Send, Search, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // Mock users for now - you can implement a real endpoint
            setUsers([
                { _id: '1', name: 'John Doe', email: 'john@example.com', online: true },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', online: false },
                { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', online: true },
            ]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectUser = (selectedUser) => {
        setSelectedUser(selectedUser);
        // Mock messages - implement real message fetching
        setMessages([
            { _id: '1', sender: selectedUser._id, text: 'Hey! How are you?', createdAt: new Date() },
            { _id: '2', sender: user?.id, text: 'I\'m good! Working on a new project.', createdAt: new Date() },
            { _id: '3', sender: selectedUser._id, text: 'That sounds great! What tech stack?', createdAt: new Date() },
        ]);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const message = {
            _id: Date.now().toString(),
            sender: user?.id,
            text: newMessage,
            createdAt: new Date()
        };

        setMessages([...messages, message]);
        setNewMessage('');
        toast.success('Message sent!');
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-12rem)] flex gap-4">
            {/* Users List */}
            <div className="w-80 card p-4 flex flex-col">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-100 mb-3">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-dark-800 border-dark-700 rounded-lg py-2 pl-9 pr-3 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1">
                    {filteredUsers.map((u) => (
                        <motion.div
                            key={u._id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectUser(u)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedUser?._id === u._id
                                    ? 'bg-accent-blue/10 border border-accent-blue/20'
                                    : 'hover:bg-dark-800'
                                }`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 avatar text-sm">
                                    {u.name.charAt(0)}
                                </div>
                                <Circle
                                    size={10}
                                    className={`absolute bottom-0 right-0 ${u.online ? 'text-green-500 fill-current' : 'text-gray-600 fill-current'}`}
                                />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-medium text-sm text-gray-200 truncate">{u.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 card flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-dark-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 avatar text-sm">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-100">{selectedUser.name}</h3>
                                    <p className="text-xs text-gray-500">
                                        {selectedUser.online ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] ${msg.sender === user?.id
                                            ? 'bg-accent-blue text-white'
                                            : 'bg-dark-800 text-gray-200'
                                        } rounded-lg px-4 py-2`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${msg.sender === user?.id ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-dark-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-dark-800 border-dark-700 rounded-lg px-4 py-2 text-sm"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="btn-primary">
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-3">💬</div>
                            <p className="text-sm">Select a user to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
