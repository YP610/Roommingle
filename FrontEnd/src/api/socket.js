import { io } from 'socket.io-client';

const socket = io('http://localhost:1000', {
    //path: '/socket.io',
    autoConnect: false, // Connect manually when user logs in
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export default socket;