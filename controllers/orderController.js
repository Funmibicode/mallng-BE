import Order from "../models/OrderModel.js";
import Payment from "../models/PaymentModel.js";



// @desc Get buyer's own orders
const getMyOrders = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const orders = await Order.find({ user: _id })
      .populate("vendor", "name email")
      .populate("items.product", "name price images");

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};


// @desc Get vendor's orders
const getVendorOrders = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const orders = await Order.find({ vendor: _id })
      .populate("user", "name email")
      .populate("items.product", "name price images");

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};



// @desc Get single order by ID
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("vendor", "name email")
      .populate("payment")
      .populate("items.product", "name price images");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};



// @desc Vendor updates order to shipped
const updateOrderStatus = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (_id.toString() !== order.vendor.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this order");
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "shipped" },
      { new: true }
    );

    res.status(200).json({ msg: "Order marked as shipped", order: updated });
  } catch (error) {
    next(error);
  }
};




// @desc Buyer confirms delivery — triggers escrow release
const confirmDelivery = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (req.user._id.toString() !== order.user.toString()) {
      res.status(403);
      throw new Error("Not authorized, only the buyer can confirm delivery");
    }

    await Order.findByIdAndUpdate(
      req.params.id,
      { status: "delivered" },
      { new: true }
    );

    await Payment.findByIdAndUpdate(
      order.payment,
      { escrowReleased: true }
    );

    res.status(200).json({
      msg: "Delivery confirmed, payment released to vendor",
    });
  } catch (error) {
    next(error);
  }
};





export {
  getMyOrders,
  getVendorOrders,
  getOrderById,
  updateOrderStatus,
  confirmDelivery,
};