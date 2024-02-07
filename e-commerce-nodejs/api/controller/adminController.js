const bcrypt = require("bcrypt");
const multer = require('multer');
const { validate, generateAuthToken } = require("../../utils");
const { adminModel, updateAdminData } = require("../modal/adminModal");
const { uploadAdminProfileImage } = require("../middleware");

////////////////////////////////////////////////////
//****************Admin Registration**************//
////////////////////////////////////////////////////
const registerAdmin = async (req, res) => {
  try {
    const { admin_email, password } = req.body;
    const { error } = validate(admin_email, password);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const admin = await adminModel.findOne({ admin_email });
    if (admin) return res.status(409).send({ message: "Email already exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    const postAdmin = await adminModel.create({
      ...req.body,
      password: hashPassword,
    });

    res.status(201).send({ message: "Admin created successfully." });
  } catch (error) {
    console.log("Admin register error: ", error.message);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

//////////////////////////////////////////////
//****************Admin Login***************//
//////////////////////////////////////////////
const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validate(email, password);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const admin = await adminModel.findOne({ admin_email: email });
    if (!admin)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const token = generateAuthToken(admin._id, "Admin");

    const data = { ...admin.toObject() };
    delete data.password;
    res.status(200).send({ token, data, message: "Login successfull" });
  } catch (error) {
    console.log("Admin Login Error: ", error.message);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

///////////////////////////////////////////////////
//****************Get Admin Details**************//
///////////////////////////////////////////////////
const getAdminController = async (req, res) => {
  try {
    console.log("req parsedUrl>>>>> ", req._parsedUrl.pathname);

    const { _id } = req.user;
    const getAdmin = await adminModel.findById(_id, { password: 0 });
    res.status(200).send(getAdmin);
  } catch (error) {
    console.log("getAdminController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

//////////////////////////////////////////////////////
//****************Update Admin Details**************//
//////////////////////////////////////////////////////
const updateAdminController = async (req, res) => {
  try {
    const { _id } = req.user;
    const admin_profile_picture = req.files[0]?.filename;
    console.log("admin_profile_picture>> ", req.files[0]);
    const updateAdmin = await updateAdminData(_id, {
      ...req.body,
      admin_profile_picture,
    });
    if (updateAdmin.status == 200)
      res
        .status(200)
        .send({
          data: updateAdmin.data,
          message: "Profile updated successfully.",
        });
    else {
      res.status(400).send({ message: updateAdmin.message });
    }
  } catch (error) {
    console.log("updateAdminController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = {
  registerAdmin,
  adminLoginController,
  getAdminController,
  updateAdminController,
};
