const Order = require('../models/Order');
const Payment=require('../models/Payment');

// Lọc đơn hàng theo trạng thái và thời gian
const getOrders = async (req, res) => {
  const { status, dateFilter, page = 1, limit = 4 } = req.query;  // Lấy các tham số từ query, mặc định page = 1 và limit = 10

  try {
    let query = { 
      isDelete: false,
      deliveryStatus: status 
    };

    // Lọc theo ngày hôm nay nếu có tham số dateFilter
    if (dateFilter === 'today') {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Bắt đầu ngày hôm nay
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Kết thúc ngày hôm nay
      query.createdAt = { $gte: startOfDay, $lt: endOfDay }; // Lọc đơn hàng trong ngày hôm nay
    }

    // Tính toán phân trang
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments(query); // Đếm tổng số đơn hàng
    const totalPages = Math.ceil(totalOrders / limit); // Tính tổng số trang

    // Lấy đơn hàng theo phân trang
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      totalOrders,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lọc đơn hàng theo trạng thái và thời gian' });
  }
};


// Cập nhật trạng thái đơn hàng
// const updateOrderStatus = async (req, res) => {
//   const { id } = req.params;
//   const { deliveryStatus } = req.body;

//   if (!deliveryStatus) {
//     return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
//   }

//   try {
//     const order = await Order.findOneAndUpdate(
//       { _id: id, isDelete: false },
//       { deliveryStatus },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc đã bị xóa' });
//     }

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng' });
//   }
// };
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { deliveryStatus } = req.body;

  if (!deliveryStatus) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    const order = await Order.findOne({ _id: id, isDelete: false }).populate('payment_id');

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc đã bị xóa' });
    }

    // Kiểm tra trạng thái đơn hàng và cập nhật trạng thái thanh toán nếu cần
    if (
      order.deliveryStatus === 'Đang vận chuyển' &&
      deliveryStatus === 'Đã giao' &&
      order.payment_id.method === 'Cash on Delivery' &&
      order.payment_id.status === 'Chưa thanh toán'
    ) {
      await Payment.findByIdAndUpdate(order.payment_id._id, { status: 'Đã thanh toán' });
    }

    // Cập nhật trạng thái đơn hàng
    order.deliveryStatus = deliveryStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng' });
  }
};

// Lấy chi tiết đơn hàng theo orderId
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params; // Get the orderId from the URL

  try {
    const order = await Order.findOne({ _id: orderId, isDelete: false })
      .populate('user_id', 'name email') // Populate user info if needed
      .populate('products.product_id', 'name price') // Populate product details
      .populate('payment_id') // Populate payment details
      .populate('address_id'); // Populate address if needed

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng' });
  }
};


module.exports = {
  getOrders,
  updateOrderStatus,
  getOrderDetails
};

