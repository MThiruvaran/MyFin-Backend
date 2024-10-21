const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },

  loanType: {
    type: String,
    enum: ["personal", "auto", "home", "education"],
    required: true,
  },

  principalAmount: {
    type: Number,
    required: true,
  },

  interestRate: {
    type: Number,
    required: true,
  },

  tenureMonths: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "disbursed", "completed"],
    default: "pending",
  },

  monthlyEMI: {
    type: Number,
  },

  repaymentSchedule: [
    {
      dueDate: { type: Date },
      amount: { type: Number },
      isPaid: { type: Boolean, default: false },
    },
  ],
  approvalDate: {
    type: Date,
  },

  disbursementDate: {
    type: Date,
  },

  rejectionReason: {
    type: String,
  },
});

// Automatically calculate the EMI based on principal, interest, and tenure
LoanSchema.pre("save", function (next) {
  if (
    this.isModified("principalAmount") ||
    this.isModified("interestRate") ||
    this.isModified("tenureMonths")
  ) {
    const rate = this.interestRate / (12 * 100); // Monthly interest rate
    const time = this.tenureMonths; // Time in months

    // Calculate EMI using the formula: EMI = [P * R * (1+R)^N] / [(1+R)^N-1]
    this.monthlyEMI =
      (this.principalAmount * rate * Math.pow(1 + rate, time)) /
      (Math.pow(1 + rate, time) - 1);
  }
  next();
});

module.exports = mongoose.model("Loan", LoanSchema);
