const express = require("express");
const {
  registerAdmin,
  adminLoginController,
  getAdminController,
  updateAdminController,
} = require("../api/controller/adminController");
const { verifyToken, uploadProfileImageByRole } = require("../api/middleware");
const authRoutes = express.Router();

authRoutes.post("/registerAdmin", registerAdmin);
authRoutes.post("/adminLogin", adminLoginController);
authRoutes.get("/getAdminDetails", verifyToken, getAdminController);
authRoutes.put(
  "/updateAdminDetails",
  verifyToken,
  uploadProfileImageByRole,
  updateAdminController
);
authRoutes.use(
  "/adminProfileImage",
  verifyToken,
  express.static("fileUpload/profileImages/admin")
);

module.exports = { authRoutes };
