require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const complaintRoutes = require('./src/routes/complaintRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('socketio', io);

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API operational', timestamp: new Date().toISOString() });
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (complaintId) => {
    socket.join(complaintId);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.complaintId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
