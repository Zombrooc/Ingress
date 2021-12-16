const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  // status: {
  //   type: String,
  //   required: true,
  // },
  // priority: {
  //   type: String,
  //   required: true,
  // },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // assignedUser: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },  
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
