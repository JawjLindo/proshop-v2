import { Middleware } from '../middleware';
import { Models } from '../models';

const addOrderItems = Middleware.asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Models.Order({
      orderItems: orderItems.map((x: any) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user?._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

const getMyOrders = Middleware.asyncHandler(async (req, res) => {
  const orders = await Models.Order.find({ user: req.user?._id });
  res.status(200).json(orders);
});

const getOrderById = Middleware.asyncHandler(async (req, res) => {
  const user = await Models.User.findById(req.user?.id);

  const order = await Models.Order.findById(req.params.id).populate(
    'user',
    'id name email'
  );

  if (order) {
    if (user?.isAdmin || user?._id.toString() === order.user._id.toString()) {
      res.status(200).json(order);
    } else {
      res.status(401);
      throw new Error('This is not your order and you are not an admin');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const updateOrderToPaid = Middleware.asyncHandler(async (req, res) => {
  const order = await Models.Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order?.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const updateOrderToDelivered = Middleware.asyncHandler(async (req, res) => {
  const order = await Models.Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order?.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getOrders = Middleware.asyncHandler(async (_req, res) => {
  const orders = await Models.Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

export const orderController = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
