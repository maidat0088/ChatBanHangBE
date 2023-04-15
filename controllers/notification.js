const Notification = require("../models/notification");

exports.getNotification = async (req, res, next) => {
  const allNotifications = await Notification.find();
  return res.json(allNotifications.reverse());
};
