const mongoose = require("mongoose");

const productReviewSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: [true, "Customer id is required!"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sellers",
      required: [true, "Product id is required!"],
    },
    productRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    productReview: String,
    productReviewImages: [String],
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
  { timestamps: true, strict: false }
);

// productReviewSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });

const productReview = mongoose.model("productReviews", productReviewSchema);
