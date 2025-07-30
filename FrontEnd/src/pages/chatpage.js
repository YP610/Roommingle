import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../api/socket';
import { defaultAvatar } from '../config';

export default function ChatPage() {
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([]);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const { userId } = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    // Fetch chat or create new one
    useEffect(() => {
        const fetchChat = async () => {
            try {
                const token = localStorage.getItem('token');
                const endpoint = userId 
                    ? `/api/userRoutes/chat/${userId}`
                    : '/api/userRoutes/chats';
                
                const res = await fetch(`http://localhost:1000${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch chats');
                }
                
                const data = await res.json();
                if (userId) {
                    setChat(data);
                } else {
                    setChats(Array.isArray(data) ? data: []);
                };
            } catch (err) {
                setError('Failed to load chat');
                setChats([]);
            }
        };

        fetchChat();
    }, [userId]);

    // Socket.io setup
    useEffect(() => {
        if (!socket.connected) {
            socket.auth = { token: localStorage.getItem('token') };
            socket.connect();
            // tell the server which user-room to join
            const me = JSON.parse(localStorage.getItem('user'));
            socket.emit('joinUserRoom', me._id);
        }

        const handleNewMessage = (data) => {
            if (userId && data.chatId === chat?._id) {
                setChat(prev => ({
                    ...prev,
                    messages: [...prev.messages, data.message]
                }));
            }
            // Update last message in chats list
            setChats(prev => prev.map(c => 
                c._id === data.chatId 
                    ? { ...c, messages: [...c.messages, data.message] }
                    : c
            ));
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('messageError', (err) => setError(err.error));

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('messageError');
        };
    }, [userId, chat]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat?.messages]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            socket.emit('sendMessage', {
                chatId: chat._id,
                fromUserId: currentUser._id,
                text: message
            });
            setMessage('');
        } catch (err) {
            setError('Failed to send message');
        }
    };

    return (
        <div className="chat-container">
            {/* Chat list sidebar */}
            <div className="chat-list">
                <h3>Your Chats</h3>
                {Array.isArray(chats) && chats.length > 0 ? (
                    chats.map(c => {
                        const otherUser = c.participants?.find(p => p._id !== currentUser._id);
                        if (!otherUser) return null;
                        
                        return (
                            <div 
                                key={c._id} 
                                className="chat-preview"
                                onClick={() => navigate(`/chat/${otherUser._id}`)}
                            >
                                <img 
                                    src={otherUser.profilePic || defaultAvatar} 
                                    alt={otherUser.name}
                                />
                                <div>
                                    <h4>{otherUser.name}</h4>
                                    <p>{c.messages?.[0]?.text || 'No messages yet'}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No chats available</p>
                )}
            </div>

            {/* Main chat area */}
            <div className="chat-area">
                {chat ? (
                    <>
                        <div className="chat-header">
                            <h3>{chat.participants.find(p => p._id !== currentUser._id)?.name}</h3>
                        </div>
                        <div className="messages">
                            {chat.messages.map(msg => (
                                <div 
                                    key={msg._id} 
                                    className={`message ${msg.from._id === currentUser._id ? 'sent' : 'received'}`}
                                >
                                    <img className='profile-pic'
                                        src={msg.from.profilePic || defaultAvatar} 
                                        alt={msg.from.name}
                                    />
                                    <div className="message-content">
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type a message..."
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <p>Select a chat to start messaging</p>
                )}
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
}