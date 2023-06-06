const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
  customers: [String],
});

// Compiling the model
// Connects launchesSchema to launches collection (determined by the name Launch, mongoose will pluralize and lowercase it)
const launches = mongoose.model("Launch", launchesSchema);

module.exports = launches;
