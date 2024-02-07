const { userModel } = require("../Modal/userModal");
const { visitModel } = require("../Modal/visiter");
const { validate, generateAuthToken } = require("../utils");
const bcrypt = require("bcrypt");

const userSignUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    const userData = { fullName, email,password: hashPassword };
    await userModel.create(userData);
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validate(email, password);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const isUserExits = await userModel.findOne({ email });
    if (!isUserExits) return res.status(401).send({ message: "Invalid Email" });

    const validPassword = await bcrypt.compare(password, isUserExits.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password" });
    const token = generateAuthToken({userId:isUserExits._id});

    const data = { ...isUserExits.toObject() };
    delete data.password;
    res.status(200).send({ token, data, message: "Login successfull" });
  } catch (error) {
    console.log("user Login Error: ", error.message);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const generateDataId=async (req, res) => {
  try {
    const Id = req.userId
    const ipAddress = req.socket.remoteAddress;
  
    //ipAddress agar same hai to add na ho
    await visitModel.create({dataId:Id,ipAddress});
    res.status(200).json({ userId:Id, message: 'Visit recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAnalyticsData=async (req, res) => {
  try {
    const Id = req.userId

    const userCount = await userModel.countDocuments();
    const uniqueVisitorsCount = await visitModel.aggregate([
      {
        $group: {
          _id: '$ipAddress',
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    
    const totalVisits = await visitModel.countDocuments();
    res.status(200).json({ userCount, uniqueVisitors:uniqueVisitorsCount.length, totalVisits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = { userSignUp, userLoginController,generateDataId,getAnalyticsData };
