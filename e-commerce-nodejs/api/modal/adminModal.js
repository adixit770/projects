const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    admin_name: String,
    admin_email: String,
    admin_mobile: String,
    password: String,
    admin_profile_picture: String,
    otp: String,
    otpExpire: {
      type: Date,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: false }
);

const adminModel = mongoose.model("admins", adminSchema);

const updateAdminData = async (_id, value) => {
  try {
    const updateAdmin = await adminModel.findByIdAndUpdate(_id, value, {
      new: true,
    });
    const data = { ...updateAdmin.toObject() };
    delete data.password;
    return { data: updateAdmin, status: 200 };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports = { adminModel, updateAdminData };
