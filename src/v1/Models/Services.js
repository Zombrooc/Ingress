const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true
  },
  serviceDescription: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Services', ServiceSchema);
