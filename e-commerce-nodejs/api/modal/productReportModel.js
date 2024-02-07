const mongoose = require("mongoose");

const productReportSchema = mongoose.Schema(
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
    productReportSubject: {
      type: String,
      required: [true, "Subject is required."],
    },
    productReport: String,
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

// productReportSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });

const productReport = mongoose.model("productReports", productReportSchema);
