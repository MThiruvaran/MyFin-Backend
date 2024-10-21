const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Keep this if user lookup is frequent
  transactionType: {
    type: String,
    enum: ["deposit", "withdraw", "transfer"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  }, // Positive for deposit/transfer, negative for withdraw
  recipientAccountNumber: {
    type: String,
    required: function () {
      return this.transactionType === "transfer";
    },
  }, // Required only for transfers
  recipientFullName: {
    type: String,
    required: function () {
      return this.transactionType === "transfer";
    },
  }, // Optional and applicable only for transfers
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Automatically sets the transaction time
});

module.exports = mongoose.model("Transaction", TransactionSchema);
