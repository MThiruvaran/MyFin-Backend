const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  termInMonths: { type: Number, required: true }, //? Duration of the loan in months
  emi: { type: Number, required: true }, //? Calculated EMI based on loan amount, interest, term
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: {
    adminID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminName: { type: String },
  }, //? Admin who approved/rejected the loan
});

module.exports = mongoose.model("Loan", LoanSchema);
