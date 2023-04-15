const Order = require("../models/order");
const User = require("../models/user");
const Notification = require("../models/notification");
const io = require("../socket");

exports.getOrders = async (req, res, next) => {
  const allOrders = await Order.find()
    .populate({
      path: "creator",
      populate: "user",
    })
    .populate({
      path: "producer",
      populate: "user",
    })
    .populate({
      path: "shipper",
      populate: "user",
    });
  return res.json(allOrders);
};

exports.getOrdersQuantity = async (req, res, next) => {
  const createOrdersQuantity = await Order.find({ status: 'create' }).count();
  const produceOrdersQuantity = await Order.find({ status: 'produce' }).count();
  const shipOrdersQuantity = await Order.find({ status: 'ship' }).count();
  const successOrdersQuantity = await Order.find({ status: 'success' }).count();
  return res.json({ createOrdersQuantity, produceOrdersQuantity, shipOrdersQuantity, successOrdersQuantity });
}

exports.getCreateOrder = async (req, res, next) => {
  const createOrders = await Order.find({ status: 'create' })
    .populate({
      path: "creator",
      populate: "user",
    })

  return res.json(createOrders);
};

exports.getProduceOrder = async (req, res, next) => {
  const produceOrders = await Order.find({ status: 'produce' })
    .populate({
      path: "producer",
      populate: "user",
    })

  return res.json(produceOrders);
};

exports.getShipOrder = async (req, res, next) => {
  const shipOrders = await Order.find({ status: 'ship' })
    .populate({
      path: "shipper",
      populate: "user",
    })

  return res.json(shipOrders);
};

exports.getSuccessOrder = async (req, res, next) => {
  const successOrders = await Order.find({ status: 'success' })
    .populate({
      path: "shipper",
      populate: "user",
    })

  return res.json(successOrders);
};

exports.postCreateOrder = async (data) => {
  const { quantity, detail, creator } = data;
  const date = new Date(Date.now());
  const user = await User.findById(creator.id);
  const createdAt =
    date.toLocaleDateString([], { timeZone: 'Asia/Saigon' }) +
    " - " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: 'Asia/Saigon' });
  const status = "create";
  const newOrder = new Order({
    quantity,
    detail,
    status,
    creator: { user, createdAt },
  });
  await newOrder.save();
  io.getIO().emit('get-create-order', newOrder);
  const newNotification = new Notification({
    userName: creator.name,
    content: " đã tạo đơn hàng mới vào ",
    avatar: creator.photo,
    createdAt,
  });
  await newNotification.save();
  io.getIO().emit("add-new-create-order-noti", newNotification);
  const createOrdersQuantity = await Order.find({ status: 'create' }).count();
  io.getIO().emit("create-order-quantity", createOrdersQuantity);
};

exports.postStartProduceOrder = async (data) => {
  const { producerId, orderId } = data;
  const order = await Order.findById(orderId);
  if (order.producer.user !== undefined) {
    return;
  }
  const user = await User.findById(producerId);
  const date = new Date(Date.now());
  const produceStart =
    date.toLocaleDateString([], { timeZone: 'Asia/Saigon' }) +
    " - " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: 'Asia/Saigon' });
  order.producer = { user, produceStart };
  order.status = "produce";
  await order.save();
  const createOrdersQuantity = await Order.find({ status: 'create' }).count();
  io.getIO().emit("create-order-quantity", createOrdersQuantity);
  const produceOrdersQuantity = await Order.find({ status: 'produce' }).count();
  io.getIO().emit("produce-order-quantity", produceOrdersQuantity);
  io.getIO().emit('get-start-produce-order', order);
};

exports.postEndProduceOrder = async (data) => {
  const { orderId } = data;
  const order = await Order.findById(orderId).populate({
    path: "producer",
    populate: "user",
  });
  const date = new Date(Date.now());
  const produceEnd =
    date.toLocaleDateString([], { timeZone: 'Asia/Saigon' }) +
    " - " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: 'Asia/Saigon' });
  order.producer = { ...order.producer, produceEnd };
  await order.save();
  io.getIO().emit('get-end-produce-order', order);
};

exports.postStartShipOrder = async (data) => {
  const { shipId, orderId } = data;
  const order = await Order.findById(orderId);
  if (order.shipper.user !== undefined) {
    return;
  }
  const user = await User.findById(shipId);
  const date = new Date(Date.now());
  const shipStart =
    date.toLocaleDateString([], { timeZone: 'Asia/Saigon' }) +
    " - " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: 'Asia/Saigon' });
  order.shipper = { user, shipStart };
  order.status = "ship";
  await order.save();
  const produceOrdersQuantity = await Order.find({ status: 'produce' }).count();
  io.getIO().emit("produce-order-quantity", produceOrdersQuantity);
  const shipOrdersQuantity = await Order.find({ status: 'ship' }).count();
  io.getIO().emit("ship-order-quantity", shipOrdersQuantity);
  io.getIO().emit('get-start-ship-order', order);
};

exports.postEndShipOrder = async (data) => {
  const { orderId } = data;
  const order = await Order.findById(orderId).populate({
    path: "shipper",
    populate: "user",
  });
  const date = new Date(Date.now());
  const shipEnd =
    date.toLocaleDateString([], { timeZone: 'Asia/Saigon' }) +
    " - " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: 'Asia/Saigon' });
  order.shipper = { ...order.shipper, shipEnd };
  order.status = "success";
  await order.save();
  const shipOrdersQuantity = await Order.find({ status: 'ship' }).count();
  io.getIO().emit("ship-order-quantity", shipOrdersQuantity);
  const successOrdersQuantity = await Order.find({ status: 'success' }).count();
  io.getIO().emit("success-order-quantity", successOrdersQuantity);
  io.getIO().emit('get-end-ship-order', order);
};