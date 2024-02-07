const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        productPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Delievered", "Completed", "Declined"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash On Delivery", "UPI", "Other"],
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
  {
    timestamps: true,
  }
);

// orderSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });
const Order = mongoose.model("ProductOrders", orderSchema);
