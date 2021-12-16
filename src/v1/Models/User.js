const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        );
      },
      message: "Email inválido",
    },
  },
  password: {
    type: String,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(value);
      },
      message: "CPF inválido",
    },
    select: false,
  },
  address: {
    street: {
      type: String,
      required: true,
      select: false,
    },
    number: {
      type: Number,
      required: true,
      select: false,
    },
    neighborhood: {
      type: String,
      required: true,
      select: false,
    },
    city: {
      type: String,
      required: true,
      select: false,
    },
    state: {
      type: String,
      required: true,
      select: false,
    },
    country: {
      type: String,
      required: true,
      select: false,
    },
    zipCode: {
      type: String,
      required: true,
      select: false,
    },
  },
  age: {
    type: Number,
    required: true,
    select: false,
  },
  phone: {
    type: String,
    required: true,
    select: false,
  },
  birthDate: {
    type: Date,
    required: true,
    select: false,
  },
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
    select: false,
  },
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

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hashSync(this.password, 10);
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", userSchema);
