const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  creator: {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
  producer: {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    produceStart: {
      type: String,
    },
    produceEnd: {
      type: String,
    }
  },
  shipper: {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    shipStart: {
      type: String,
    },
    shipEnd: {
      type: String,
    }
  }
});

module.exports = mongoose.model("Order", orderSchema);