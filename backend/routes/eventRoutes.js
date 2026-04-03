const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Add Event
// Create event
router.post("/", async (req, res) => {
  try {
    const { name, date, description, location } = req.body;

    // ✅ Validation
    if (!name || !date || !description || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const event = new Event({ name, date, description, location });
    await event.save();

    res.json(event);

  } catch (err) {
    res.status(500).json({ error: "Error creating event" });
  }
});

// Get events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

module.exports = router;