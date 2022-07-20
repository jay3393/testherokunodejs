const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');
const messageRoutes = require('./routes/messageRoute')
const socket = require('socket.io');
const path = require('path');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, './public/build')));

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/build/index.html'));
});

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("DB connection successful");
})
.catch((err) => {
    console.log(err.message);
});

// Runs the backend server on port 5000
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`Established a socket connection with ${userId} on socket ${socket.id}`);
    });

    socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
        socket.to(sendUserSocket).emit("receive-msg", data.msg);
    }
});
});

