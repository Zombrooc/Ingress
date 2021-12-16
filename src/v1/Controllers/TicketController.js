require("dotenv").config();
const { compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");

const User = require("../Models/User");
const Event = require("../Models/Event");
const Ticket = require("../Models/Ticket");

module.exports = {
  async store(req, res) {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).send({
        message: "Evento não encontrado",
      });
    }

    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).send({
        message: "Usuário não encontrado",
      });
    }

    if (user.age < event.minimalAge) {
      return res.status(400).send({
        message: "Usuário não tem idade suficiente para participar do evento",
      });
    }

    if (event.capacity <= event.tickets.length) {
      return res.status(400).send({
        message: "Evento lotado",
      });
    }

    const newTicket = await Ticket.create({
      owner: req.userID,
      event: eventId,
    });

    user.tickets.push(newTicket._id);
    await user.save();

    event.tickets.push(newTicket._id);
    await event.save();

    return res.send(newTicket);
  },
  async show(req, res) {
    const ticket = await Ticket.findById(req.body.ticketId);

    return res.status(200).send(ticket);
  },
  async update(req, res) {
    const done = await Ticket.findByIdAndUpdate(req.ticketId, {
      $set: {
        ...req.body,
        updatedAt: new Date(),
      },
    });

    return res.status(200).send();
  },
};
