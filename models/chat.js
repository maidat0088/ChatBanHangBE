const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  conversation: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
