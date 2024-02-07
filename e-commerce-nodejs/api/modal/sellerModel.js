const mongoose = require("mongoose");
const { addressSchema } = require("./addressModel");

const sellerSchema = new mongoose.Schema(
  {
    sellerName: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
      unique: true,
    },
    sellerMobile: {
      type: String,
    },
    password: {
      type: String,
    },
    sellerAddress: addressSchema,
    dateOfBirth: {
      type: Date,
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
      default: "Active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

sellerSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.isDeleted && !update.$set.deletedAt) {
    update.$set.deletedAt = new Date();
    delete update.$set.updatedAt;
  }
  next();
});

const Seller = mongoose.model("sellers", sellerSchema);
