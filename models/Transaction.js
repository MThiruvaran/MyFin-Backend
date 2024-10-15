const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transactionType: { type: String, enum: ['deposit', 'withdraw', 'transfer'], required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },  // A unique ID for the transaction
  transferTo: {
    accountNumber:{type:Number},
    fullName:{type:String}
  },                     // Optional, e.g., for fund transfer
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
