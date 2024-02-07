const Joi = require("joi");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const validate = (email, password) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate({ email, password });
};

const generateAuthToken = (_id, role) => {
  const token = jwt.sign({ _id, role }, process.env.JWTPRIVATEKEY, {
    expiresIn: "8h",
  });
  return token;
};

const sendEmail = (email, subject, html) => {
  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject,
    html,
  };
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email: ", err.message);
    }
  });
};

module.exports = { validate, generateAuthToken, sendEmail };
