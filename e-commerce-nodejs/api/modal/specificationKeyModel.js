const mongoose = require("mongoose");

const specificationKeySchema = mongoose.Schema(
  {
    specificationKeyName: { type: String, required: true },
    specificationKeySlug: String,
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

// specificationKeySchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });
const specificationKey = mongoose.model(
  "specificationKeys",
  specificationKeySchema
);
