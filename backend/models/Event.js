const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  description: String,
  location: String
});

module.exports = mongoose.model("Event", eventSchema);