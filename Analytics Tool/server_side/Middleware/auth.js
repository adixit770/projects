const jwt = require("jsonwebtoken");
const { userModel } = require("../Modal/userModal");

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token)
      return res.status(401).send({
        message: "Token Required",
      });
  console.log(jwt.verify(token, process.env.JWTPRIVATEKEY));
    jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, user) => {
      if (err) {
        return res.status(401).send({
          message: "Invalid Token",
        });
      }
     
      req.userId = user.id ;
      next();
    });
  };
  
  module.exports = {verifyToken};