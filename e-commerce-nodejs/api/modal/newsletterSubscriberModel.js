const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema(
  {
    subscriberEmail: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timeStamps: true, strict: false }
);

// subscriberSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });

const Subscriber = mongoose.model("subscribers", subscriberSchema);
