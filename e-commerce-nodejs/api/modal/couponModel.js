const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    couponName: {
      type: String,
      required: [true, "Coupon name is required!"],
    },
    couponCode: {
      type: String,
      required: [true, "Coupon code is required!"],
    },
    countryId: { type: String },
    cityId: { type: String },
    stateId: { type: String },
    couponType: {
      type: String,
      enum: ["Percent", "Flat"],
      required: true,
    },
    amountOrPercent: { type: Number },
    maxDiscount: { type: Number },
    minDiscount: { type: Number },
    appliedType: { type: String, enum: ["Category", "Brand", "Bill"] },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    couponApplyLimit: {
      type: ["Single", "Multiple", "Monthly"],
    },
    startDate: { type: Date },
    endDate: { type: Date },
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

const Coupon = mongoose.model("coupons", couponSchema);

/*
 * inventory,
 * product variant,
 * coupon,
 * payment method,
 *
 *
 *
 *
 *
 *
 */
