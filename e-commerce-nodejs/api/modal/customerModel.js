const mongoose = require("mongoose");
const { addressSchema } = require("./addressModel");

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    customerProfilePicture: {
      type: String,
    },
    customeGender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
      unique: true,
    },
    customerMobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    addresses: [addressSchema],
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
    },
    //   defaultAddress: {
    //     type: Number,
    //     default: 0 // Index of the default address in the 'addresses' array
    //   },
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
    otp: {
      type: String,
    },
    expireAt: {
      type: Date,
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

// customerSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });

const Customer = mongoose.model("customers", customerSchema);
