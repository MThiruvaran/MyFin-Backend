const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const Accounts = require("../models/Accounts");

router.get("/user-account", async (req, res) => {
  const { email } = req.user;
  console.log(email);
  try {
    const account = await Accounts.findOne({ email }).lean();
    if (!account) return res.status(404).json({ message: "account not found" });
    res.status(200).json(account);
  } catch (error) {
    console.log("error in /user-account: ", error);
    res.status(400).json({ message: error.message });
  }
});

// Route to create a new investment account (Loan, RD, FD)
router.post("/add-investment-account", async (req, res) => {
  try {
    const {
      accountNumber,
      accountType,
      initialBalance,
      interestRate,
      maturityDate,
    } = req.body;

    // Find the user's main account
    const account = await Accounts.findOne({ accountNumber });
    if (!account)
      return res.status(404).json({ error: "Main account not found" });

    // Generate a unique accountId for the new investment account
    const investmentAccountId = `${accountType}_${uuidv4()}`;

    // Create the new investment account object
    const newInvestmentAccount = {
      accountId: investmentAccountId,
      accountType: accountType,
      balance: initialBalance || 0,
      interestRate: interestRate || 0,
      maturityDate: maturityDate ? new Date(maturityDate) : null, // Optional for certain types of investments
    };

    // Add the new investment account to the user's account
    account.accounts.push(newInvestmentAccount);

    // Save the updated account
    await account.save();

    res.json({
      message: "Investment account created successfully",
      newInvestmentAccount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
