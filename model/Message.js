const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    text: String,
    attachments: [
      {
        type: String,
      },
    ],
    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    sender: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    reciever: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    post_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", schema);

module.exports = Message;
