// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

//Admin 
const authRoutesAdmin = require('./routes/authRoutes');
const brandRoutesAdmin = require('./routes/brandRoutesAdmin');
const categoryRoutesAdmin = require('./routes/categoryRoutesAdmin');
const styleRoutesAdmin = require('./routes/styleRoutesAdmin');
const productRoutesAdmin = require('./routes/productRoutesAdmin');
const imageRoutesAdmin = require('./routes/imageRoutesAdmin');
const userRoutesAdmin = require('./routes/userRoutesAdmin');
const customerRoutesAdmin = require('./routes/customerRoutesAdmin');
const discountRoutesAdmin = require('./routes/discountRoutesAdmin');
const orderRoutesAdmin = require('./routes/orderRoutesAdmin');
const paymentRoutesAdmin = require('./routes/paymentRoutesAdmin'); 
const statisticRoutesAdmin = require('./routes/statisticRoutesAdmin');

//Client 
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addressRoutes = require("./routes/addressRoutes");
const discountRoutes = require("./routes/discountRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const styleRoutes = require("./routes/styleRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const brandRoutes = require("./routes/brandRoutes");
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected')
)
.catch(err => console.log(err));



// Middleware
const corsOptions = {
  origin: [process.env.REACT_CLIENT_URL, process.env.REACT_ADMIN_URL],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Định nghĩa các route admin 
app.use('/api/auth', authRoutesAdmin);
app.use('/api/brands', brandRoutesAdmin);
app.use('/api/categories', categoryRoutesAdmin);
app.use('/api/styles', styleRoutesAdmin);
app.use('/api/productAPI', productRoutesAdmin);
app.use('/api/images', imageRoutesAdmin);
app.use('/api/users', userRoutesAdmin);
app.use('/api/customers', customerRoutesAdmin);
app.use('/api/discounts', discountRoutesAdmin);
app.use('/api/orderAPI', orderRoutesAdmin);
app.use('/api/payments', paymentRoutesAdmin);
app.use('/api/statistics', statisticRoutesAdmin);

// Định nghĩa các route user 
app.use("/api/user", userRoutes);
app.use("/api/homepage", homeRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/style", styleRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/brand", brandRoutes);
// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
