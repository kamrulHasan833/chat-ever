const User = require("../model/People");
const Conversation = require("../model/Conversation");
const Message = require("../model/Message");
const escape = require("../utilities/escape");
const { unlink } = require("fs");
const path = require("path");
const createError = require("http-errors");

// get inbox
async function getInbox(req, res) {
  const conversations = await Conversation.find({
    $or: [
      { "creator.id": req.user.id },
      {
        "participant.id": req.user.id,
      },
    ],
  });

  res.render("inbox", { conversations });
}

// search users
async function searchUsers(req, res) {
  const username = req.body.username;

  const searchQuery = username.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    const result = await User.find({
      $or: [
        { name: name_search_regex },
        { email: email_search_regex },
        { mobile: mobile_search_regex },
      ],
    });
    if (result.length > 0) {
      const errors = {
        common: {
          msg: "No result found!",
        },
      };
      const users = [...result];
      const finalUsers = users.filter((user) => user._id != req.user.id);
      if (finalUsers.length > 0) {
        res.status(200).json(finalUsers);
      } else {
        res.status(400).json({
          errors,
        });
      }
    } else {
      res.status(400).json({
        errors,
      });
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// create conversation
async function createConversation(req, res) {
  const newConversation = new Conversation({
    creator: {
      id: req.user.id,
      name: req.user.username,
      avatar: req.user.avatar,
    },
    participant: req.body.participant,
  });

  try {
    const conversation = await newConversation.save();
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// delete conversation
async function deleteConversation(req, res) {
  try {
    const attachments = req.body?.attachments;
    await Conversation.deleteOne({ _id: req.params.id });
    await Message.deleteMany({ conversation_id: req.params.id });

    if (attachments.length > 0) {
      attachments.forEach((img) => {
        unlink(
          path.join(__dirname, `/../public/uploads/attachments/${img}`),
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });
    }
    res.status(200).json({
      success: "Conversation was successfully deleted!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.msg,
        },
      },
    });
  }
}

// create messages
async function createMessages(req, res) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      const conversation_id = req.body.conversationId;
      const text = req.body.message ? req.body.message : null;
      const reciever = JSON.parse(req.body.participant);
      let attachments = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => attachments.push(file.filename));
      }
      const document = {
        conversation_id,
        text,
        attachments,
        sender: {
          id: req.user.id,
          name: req.user.username,
          avatar: req.user.avatar,
        },
        reciever,
      };
      const newMessage = new Message(document);

      const feedback = await newMessage.save();
      res.status(200).json({
        success: {
          common: {
            msg: "Message sved successfully!",
          },
        },
      });

      // socket io
      global.io.emit("new-message", feedback);
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(400).json({
      errors: {
        common: {
          msg: "Text message or attechment is required!",
        },
      },
    });
  }
}

// get messages
async function getMessage(req, res) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.id,
    }).sort("-createdAt");

    res.status(200).json({
      messages,
    });

    return messages;
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

async function searchConversation(req, res) {
  const conversationName = req.body.conversationName;
  if (conversationName) {
    const name_search_regex = new RegExp(escape(conversationName), "i");
    try {
      const conversations = await Conversation.find({
        $or: [
          { "creator.name": name_search_regex },
          { "participant.name": name_search_regex },
        ],
      });
      if (conversations.length > 0) {
        res.status(200).json({ conversations });
      } else {
        throw createError(400, "No conversation found!");
      }
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: {
          msg: "pleace, give searching input!",
        },
      },
    });
  }
}
module.exports = {
  getInbox,
  searchUsers,
  createConversation,
  createMessages,
  deleteConversation,
  getMessage,
  searchConversation,
};
