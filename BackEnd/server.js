//imports required packages that we installed through the terminal
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const express = require("express");
const userRoutes = require('./routes/userRoutes'); 
//requires API routes
const authRoutes = require('./routes/authRoutes');
const connectDB=require('./db');
const Chat = require('./models/chatSchema');

//express app
const app = express();
const PORT = process.env.PORT||1000;

//Socket.io
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

// Configure CORS for both Express and Socket.io
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};

app.use(cors(corsOptions));

const io = socketIo(server, {
    cors: corsOptions,
    path: '/socket.io'
});

// Attach io to app for use in routes
app.set('io', io);

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a user-specific room for private messaging
    socket.on('joinUserRoom', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    // Match responses
    socket.on('matchResponse', (data) => {
        io.to(data.receiverId).emit('matchRequestUpdate', {
            userId: data.senderId,
            action: data.action
        });
    });

    socket.on('sendMessage', async ({ chatId, fromUserId, text }) => {
        try {
            // Save message to database
            const chat = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $push: {
                        messages: {
                            from: fromUserId,
                            text: text
                        }
                    }
                },
                { new: true }
            ).populate('messages.from', 'name profilePic');

            if (!chat) {
                throw new Error('Chat not found');
            }

            // Get the other participant
            const toUserId = chat.participants.find(
                participant => !participant.equals(fromUserId)
            );

            // Emit the new message to the recipient
            const newMessage = chat.messages[chat.messages.length-1];
            io.to(toUserId.toString()).emit('newMessage', {
                chatId,
                message: {
                    _id: newMessage._id,
                    from: {
                        _id: newMessage.from._id,
                        name: newMessage.from.name,
                        profilePic: newMessage.from.profilePic
                    },
                    text: newMessage.text,
                    timestamp: newMessage.timestamp
                }
            });

            // Also send back to sender for immediate UI update
            socket.emit('newMessage', {
                chatId,
                message: {
                    _id: newMessage._id,
                    from: {
                        _id: newMessage.from._id,
                        name: newMessage.from.name,
                        profilePic: newMessage.from.profilePic
                    },
                    text: newMessage.text,
                    timestamp: newMessage.timestamp
                }
            });
        } catch (err) {
            console.error('Error sending message:', err);
            socket.emit('messageError', { error: 'Failed to send message'});
        }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
});

// Routes
// app.get("/", (req, res) => {
//     // I think this is where we should redirect from to get the algorithm grouping done,
// });//just a test (delete later)

// Uses all the request handlers imported from students.js (must include /api/students route)
app.use('/api/userRoutes', userRoutes)
app.use('/api/auth',authRoutes);

// Profile picture upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB()
    .then(() => {
        // Listens for requests
        // app.listen(PORT, () => {
        // console.log('connected to db & listening on port', PORT);
        // });
        // Start Socket.io server
        server.listen(PORT, () => {
            console.log(`Server & Socket.io on port ${PORT}`);
});
    })
    .catch((error) => {
        console.error('Error connecting to db', error);
    })




