const express = require("express");
const router = express.Router();
const Account = require("../models/Accounts");
const Transaction = require("../models/Transaction");

// *Route to deposit money
router.post("/deposit", async (req, res) => {
  try {
    const { accountNumber, amount, userId } = req.body;

    // Find the user's main account
    const account = await Account.findOne({ accountNumber });
    if (!account) return res.status(404).json({ error: "Account not found" });

    // Add the deposit amount to the main account balance
    account.balance += amount;

    // Save the updated account balance
    await account.save();

    // Log the transaction
    const transaction = new Transaction({
      userId,
      transactionType: "deposit",
      amount: amount, // Positive for deposit
    });
    await transaction.save();

    res.json({ message: "Deposit successful", balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to withdraw money
router.post("/withdraw", async (req, res) => {
  try {
    const { accountNumber, amount, userId } = req.body;

    // Find the user's main account
    const account = await Account.findOne({ accountNumber });
    if (!account) return res.status(404).json({ error: "Account not found" });

    // Check if user has sufficient balance
    if (account.balance < amount)
      return res.status(400).json({ error: "Insufficient balance" });

    // Subtract the withdrawal amount from the main account balance
    account.balance -= amount;

    // Save the updated account balance
    await account.save();

    // Log the transaction (negative amount for withdrawal)
    const transaction = new Transaction({
      userId,
      transactionType: "withdraw",
      amount: -amount, // Negative for withdrawals
    });
    await transaction.save();

    res.json({ message: "Withdrawal successful", balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to transfer money to another user
router.post("/transferToUser", async (req, res) => {
  try {
    const {
      fromAccountNumber,
      toAccountNumber,
      amount,
      userId,
      recipientFullName,
    } = req.body;

    // Find the sender's account
    const sender = await Account.findOne({ accountNumber: fromAccountNumber });
    if (!sender)
      return res.status(404).json({ error: "Sender account not found" });

    // Check if sender has sufficient balance
    if (sender.balance < amount)
      return res.status(400).json({ error: "Insufficient balance" });

    // Find the recipient's account
    const recipient = await Account.findOne({ accountNumber: toAccountNumber });
    if (!recipient)
      return res.status(404).json({ error: "Recipient account not found" });

    // Deduct the amount from the sender's balance
    sender.balance -= amount;

    // Add the amount to the recipient's balance
    recipient.balance += amount;

    // Save both accounts
    await sender.save();
    await recipient.save();

    // Log the transaction
    const transaction = new Transaction({
      userId,
      transactionType: "transfer",
      amount: amount, // Positive for transfer
      recipientAccountNumber: toAccountNumber,
      recipientFullName: recipientFullName,
    });
    await transaction.save();

    res.json({
      message: "Transfer successful",
      senderBalance: sender.balance,
      recipientBalance: recipient.balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to transfer money to an investment account (Loan, RD, FD)
router.post("/transferToInvestment", async (req, res) => {
  try {
    const { accountNumber, amount, investmentAccountId, userId } = req.body;

    // Find the user's main account
    const account = await Account.findOne({ accountNumber });
    if (!account)
      return res.status(404).json({ error: "Main account not found" });

    // Check if the user has sufficient balance
    if (account.balance < amount)
      return res.status(400).json({ error: "Insufficient balance" });

    // Find the specific investment account within the user's accounts array
    const investmentAccount = account.accounts.find(
      (acc) => acc.accountId === investmentAccountId
    );
    if (!investmentAccount)
      return res.status(404).json({ error: "Investment account not found" });

    // Deduct the amount from the main account balance
    account.balance -= amount;

    // Add the amount to the investment account balance
    investmentAccount.balance += amount;

    // Save the updated account
    await account.save();

    // Log the transaction
    const transaction = new Transaction({
      userId,
      transactionType: "transfer",
      amount: amount, // Positive for transfer
      recipientAccountNumber: accountNumber, // Same user's account
      recipientFullName: account.fullname, // Full name of the account owner
    });
    await transaction.save();

    res.json({
      message: "Transfer to investment account successful",
      mainBalance: account.balance,
      investmentAccountBalance: investmentAccount.balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
