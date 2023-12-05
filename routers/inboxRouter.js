// external imports
const express = require("express");

// internal imports
const attachmentUpload = require("../middlewares/inbox/attachmentsUpload");
const {
  getInbox,
  searchUsers,
  createConversation,
  createMessages,
  searchConversation,
  deleteConversation,
  getMessage,
} = require("../controllers/inboxController");
const decorateHtml = require("../middlewares/common/decorateHtmlHandler");
const { checkLogin } = require("../middlewares/common/checkLogin");
// setup loginRouter
const inboxRouter = express.Router();

// Get inbox
inboxRouter.get("/", decorateHtml("Inbox"), checkLogin, getInbox);

// search users
inboxRouter.post("/search", checkLogin, searchUsers);

// create conversation
inboxRouter.post("/conversation", checkLogin, createConversation);

// search conversation
inboxRouter.post("/conversation/search", searchConversation);

// delete conversation
inboxRouter.delete("/conversation/:id", checkLogin, deleteConversation);

// create message
inboxRouter.post("/message", checkLogin, attachmentUpload, createMessages);

// get message
inboxRouter.get("/message/:id", checkLogin, getMessage);

module.exports = inboxRouter;
