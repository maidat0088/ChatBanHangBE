const Chat = require("../models/chat");

exports.getMessage = async (req, res, next) => {
  const chat = await Chat.findById("642d9b8c9bd836629c00db8a");
  return res.json(chat.conversation);
};
