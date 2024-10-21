const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan"); // Assuming Loan model is in the models folder
const User = require("../models/User"); // Assuming User model for reference
const Account = require("../models/Account"); // Assuming Account model for reference

// 1. Create a new loan request
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      accountId,
      loanType,
      principalAmount,
      interestRate,
      tenureMonths,
    } = req.body;

    // Create a new loan
    const newLoan = new Loan({
      userId,
      accountId,
      loanType,
      principalAmount,
      interestRate,
      tenureMonths,
    });

    await newLoan.save();
    res
      .status(201)
      .json({ message: "Loan request created successfully", loan: newLoan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get loan details by ID
router.get("/:loanId", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId).populate(
      "userId accountId"
    );
    if (!loan) return res.status(404).json({ error: "Loan not found" });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Approve or reject a loan request
router.put("/:loanId/approve", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body; // status should be 'approved' or 'rejected'

    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    if (status === "approved") {
      loan.status = "approved";
      loan.approvalDate = new Date();
    } else if (status === "rejected") {
      loan.status = "rejected";
      loan.rejectionReason = rejectionReason || "No reason provided";
    } else {
      return res.status(400).json({ error: "Invalid status" });
    }

    await loan.save();
    res.json({ message: `Loan ${status} successfully`, loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Disburse a loan (set disbursement date and update status)
router.put("/:loanId/disburse", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    if (loan.status !== "approved") {
      return res
        .status(400)
        .json({ error: "Loan must be approved before disbursement" });
    }

    loan.status = "disbursed";
    loan.disbursementDate = new Date();

    await loan.save();
    res.json({ message: "Loan disbursed successfully", loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get repayment schedule
router.get("/:loanId/repayment-schedule", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    // Return the repayment schedule
    res.json({ repaymentSchedule: loan.repaymentSchedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Mark a repayment as paid
router.put("/:loanId/repayment/:scheduleIndex", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const { scheduleIndex } = req.params;

    if (!loan.repaymentSchedule[scheduleIndex]) {
      return res
        .status(400)
        .json({ error: "Invalid repayment schedule index" });
    }

    loan.repaymentSchedule[scheduleIndex].isPaid = true;
    await loan.save();

    res.json({
      message: "Repayment marked as paid",
      repayment: loan.repaymentSchedule[scheduleIndex],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Get all loans for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.params.userId });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Get all loans (for admin)
router.get("/admin/all", async (req, res) => {
  try {
    const loans = await Loan.find().populate("userId accountId");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
