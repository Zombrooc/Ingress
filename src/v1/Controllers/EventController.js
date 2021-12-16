require("dotenv").config();
const { compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");

const authConfig = process.env.SECRET;

const Event = require('../Models/Event');

module.exports = {
  async store(req, res) {
    const {
      title,
      description,
      capacity,
      price,
      minimalAge,
      date,
      address,
    } = req.body;

    try {
      const newEvent = await Event.create({
        title,
        description,
        capacity,
        price,
        minimalAge,
        date,
        address,
        owner: req.userID,
      });

      return res.send(newEvent);
    } catch (error) {
      return res.send(error);
    }
  },
  async show(req, res) {
    const event = await Event.findById(req.body.eventId);

    return res.status(200).send(event);
  },
  async update(req, res) {
    const done = await Event.findByIdAndUpdate(req.body.eventId, {
      $set: {
        ...req.body,
        updatedAt: new Date(),
      },
    });

    return res.status(200).send();
  },
};
