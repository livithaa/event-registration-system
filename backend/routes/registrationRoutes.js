const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");

// Register user
router.post("/", async (req, res) => {
  try {
    const { eventId, name, email, phone } = req.body;

    // ✅ Validation
    if (!eventId || !name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Duplicate check
    const existing = await Registration.findOne({ eventId, email });

    if (existing) {
      return res.status(400).json({ error: "Already registered for this event" });
    }

    // ✅ Save new registration
    const reg = new Registration({ eventId, name, email, phone });
    await reg.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get users by event
router.get("/:eventId", async (req, res) => {
  try {
    const users = await Registration.find({ eventId: req.params.eventId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

module.exports = router;