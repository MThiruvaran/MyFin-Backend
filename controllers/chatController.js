const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "senderModel", // Dynamic reference to either 'User' or 'Admin'
    required: true,
  },
  senderModel: {
    type: String,
    enum: ["User", "Admin"], // Indicates whether the sender is a User or Admin
    required: true,
  },
  content: {
    type: String,
    required: true,
  }, // Message content (text)
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Timestamp for when the message was sent
});

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the User
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  }, // Reference to the Admin handling the conversation (optional, in case no admin has been assigned yet)
  messages: [MessageSchema], // Array of messages (user and admin)
  status: {
    type: String,
    enum: ["open", "closed", "pending"],
    default: "open",
  }, // Status of the conversation (open, closed, pending)
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Timestamp for when the conversation was created
  updatedAt: {
    type: Date,
  }, // Timestamp for the last update (automatically updated)
});

ChatSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Chat", ChatSchema);
