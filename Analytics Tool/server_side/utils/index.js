const Joi = require("joi");
const jwt = require("jsonwebtoken");

const validate = (email, password) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate({ email, password });
};

const generateAuthToken = ({userId}) => {
  const token = jwt.sign({ id:userId }, process.env.JWTPRIVATEKEY, {
    expiresIn: "8h",
  });
  return token;
};


module.exports = { validate, generateAuthToken };
