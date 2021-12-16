require("dotenv").config();
const { compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");

const validateCPF = require('../services/cpfUtils');
const ageCalc = require('../services/birthDateUtils');

// const FileUtils = require('../services/fileUtils');
const authConfig = process.env.SECRET;
const User = require("../Models/User");

module.exports = {
  async store(req, res) {
    const {
      name,
      email,
      password,
      cpf,
      phone,
      address,
      birthDate,
    } = req.body;

    if (
      (await User.findOne({ email }))
    ) {
      return res.status(409).send({
        field: "email",
        message: "Já existe um usuário com esse e-mail",
      });
    }

    if (validateCPF(cpf) == false) {
      return res.status(409).send({
        field: "cpf",
        message: "CPF inválido",
      });
    }

    if (
      (await User.findOne({ cpf }))
    ){
      return res.status(409).send({
        field: "cpf",
        message: "Já existe um usuário com esse CPF",
      });
    }

    // let publicUrl;

    // if (req.file) {
    //   const { originalname, buffer, mimeType } = req.file;

    //   const fileUtils = new FileUtils();
    //   publicUrl = fileUtils.uploadFile(originalname, buffer, mimeType, next);
    // }

    try {
      const newUser = await User.create({
        name,
        email,
        password,
        cpf,
        phone,
        address,
        birthDate,
        age: ageCalc(birthDate),
      });

      const id = newUser.id;
      // var privateKey = fs.readFileSync(process.env.PRIVATE, "utf8");
      const token = jwt.sign({ id }, authConfig, {
        expiresIn: process.env.EXPIRES_IN || "1d",
      });

      return res.send({
        userId: newUser.id,
        name: newUser.name,
        token,
      });
    } catch (error) {
      return res.send(error);
    }
  },
  async authenticate(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(`+password`);

    if (!user) {
      return res.status(404).send({
        message: "Nenhum usuário cadastrado com esse E-mail",
        field: "email",
      });
    }

    if (!(await compareSync(password, user.password))) {
      return res.status(403).send({
        message: "Senha incorreta",
        field: "password",
      });
    }

    const id = user.id;
    // var privateKey = fs.readFileSync(process.env.PRIVATE, "utf8");
    const token = jwt.sign({ id }, authConfig, {
      expiresIn: process.env.EXPIRES_IN || "1d",
    });

    return res.send({
      userId: user.id,
      name: user.name,
      token: token,
    });
  },
  async show(req, res) {
    const user = await User.findById(req.userID);

    return res.status(200).send(user);
  },
  async update(req, res) {
    const done = await User.findByIdAndUpdate(req.userID, {
      $set: {
        ...req.body,
        updatedAt: new Date(),
      },
    });

    return res.status(200).send();
  },
  async forgotPass(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        field: "email",
        message: "Nenhum usuário com esse e-mail foi encontrado",
      });
    }

    const token = crypto.randomBytes(35).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: "zombrooc@thesimple.page",
      subject: "The Simple - Esqueci minha senha",
      templateId: "d-efe4834d15414f99b41505b2748a9b4f",
      dynamic_template_data: {
        name: user.name,
        frontendLink: "https://thesimpletech.com.br",
        token,
      },
    };

    await sgMail.send(msg, (error, result) => {
      if (error) {
        return res.send(error);
      } else {
        return res.send();
      }
    });
  },
  async resetPass(req, res) {
    const { email, password, token } = req.body;

    const user = await User.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: "Token Inválido " });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res.status(400).send({ error: " O token expirou " });
    }

    user.password = password;
    user.updatedAt = now;

    await user.save();

    return res.send({ done: "Senha alterada com sucesso" });
  },
};
