const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User schema
const Account = require("../models/Account"); // Account schema
const Loan = require("../models/Loan"); // Loan schema
const Chat = require("../models/Chat"); // Chat schema

// Admin: Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Deactivate/Activate user account
router.put("/users/:id/status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = !user.isActive; // Toggle active status
    await user.save();
    res.json({
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all accounts
router.get("/accounts", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get account by account number
router.get("/accounts/:accountNumber", async (req, res) => {
  try {
    const account = await Account.findOne({
      accountNumber: req.params.accountNumber,
    });
    if (!account) return res.status(404).json({ error: "Account not found" });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update account details
router.put("/accounts/:accountNumber", async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { accountNumber: req.params.accountNumber },
      req.body,
      { new: true }
    );
    if (!account) return res.status(404).json({ error: "Account not found" });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all loan applications
router.get("/loans", async (req, res) => {
  try {
    const loans = await Loan.find();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve or reject a loan
router.put("/loans/:loanId", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    loan.status = req.body.status; // Expected status: "approved" or "rejected"
    await loan.save();
    res.json({ message: `Loan ${loan.status} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
