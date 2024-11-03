const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User'); // Nhập model User

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Nếu bạn cần gửi cookies
};

app.use(cors(corsOptions));
app.use(express.json()); // Phân tích dữ liệu JSON trong request

// Định nghĩa các route
app.use('/api/auth', authRoutes);


// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
