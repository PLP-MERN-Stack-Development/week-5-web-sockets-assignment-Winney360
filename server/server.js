const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Images only (jpeg, jpg, png, gif)!'));
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = {};
const messages = {};
const typingUsers = {};
const rooms = ['general', 'support', 'random'];

// File upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ filename: req.file.filename });
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

// API routes
app.get('/api/messages/:room', (req, res) => {
  const room = req.params.room;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const roomMessages = messages[room] || [];
  const paginatedMessages = roomMessages.slice(startIndex, endIndex);

  res.json({
    messages: paginatedMessages,
    hasMore: endIndex < roomMessages.length,
    page,
    total: roomMessages.length,
  });
});

app.get('/api/users/:room', (req, res) => {
  const room = req.params.room;
  res.json(Object.values(users).filter(u => u.room === room));
});

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user_join', ({ username, room }) => {
    users[socket.id] = { username, id: socket.id, room: room || 'general' };
    socket.join(users[socket.id].room);
    if (!messages[users[socket.id].room]) messages[users[socket.id].room] = [];
    io.to(users[socket.id].room).emit('user_list', Object.values(users).filter(u => u.room === users[socket.id].room));
    io.to(users[socket.id].room).emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined room: ${users[socket.id].room}`);
    socket.emit('room_messages', messages[users[socket.id].room]);
  });

  socket.on('send_message', (messageData) => {
    const room = users[socket.id]?.room || 'general';
    const message = {
      ...messageData,
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      room,
    };

    if (!messages[room]) messages[room] = [];
    messages[room].push(message);

    if (messages[room].length > 100) {
      messages[room].shift();
    }

    io.to(room).emit('receive_message', message);
  });

  socket.on('send_file', ({ filename, room }) => {
    const message = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      file: `/uploads/${filename}`,
      timestamp: new Date().toISOString(),
      room,
      isFile: true,
    };

    if (!messages[room]) messages[room] = [];
    messages[room].push(message);

    if (messages[room].length > 100) {
      messages[room].shift();
    }

    io.to(room).emit('receive_message', message);
  });

  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      const room = users[socket.id].room;

      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }

      io.to(room).emit('typing_users', Object.values(typingUsers));
    }
  });

  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };

    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  socket.on('message_read', ({ messageId, room }) => {
    if (messages[room]) {
      const message = messages[room].find(m => m.id === messageId);
      if (message) {
        message.readBy = message.readBy || [];
        if (!message.readBy.includes(socket.id)) {
          message.readBy.push(socket.id);
          io.to(room).emit('read_receipt', { messageId, userId: socket.id });
        }
      }
    }
  });

  socket.on('join_room', (room) => {
    if (rooms.includes(room) && users[socket.id]) {
      const oldRoom = users[socket.id].room;
      socket.leave(oldRoom);
      users[socket.id].room = room;
      socket.join(room);
      io.to(oldRoom).emit('user_list', Object.values(users).filter(u => u.room === oldRoom));
      io.to(room).emit('user_list', Object.values(users).filter(u => u.room === room));
      socket.emit('room_messages', messages[room] || []);
      console.log(`${users[socket.id].username} switched to room: ${room}`);
    }
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username, room } = users[socket.id];
      io.to(room).emit('user_left', { username, id: socket.id });
      console.log(`${username} left the chat`);
      io.to(room).emit('user_list', Object.values(users).filter(u => u.room === room));
      delete users[socket.id];
      delete typingUsers[socket.id];
      io.to(room).emit('typing_users', Object.values(typingUsers));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };