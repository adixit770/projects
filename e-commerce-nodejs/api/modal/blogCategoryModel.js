const mongoose = require("mongoose");

const blogCategorySchema = mongoose.Schema(
  {
    blogCategoryName: String,
    blogCategorySlug: String,
    status: {
      type: String,
      enum: ["Active", "InActive"],
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

// blogCategorySchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });

const BlogCategory = mongoose.model("blogcategories", blogCategorySchema);
