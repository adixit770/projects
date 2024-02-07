const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    blogName: String,
    blogSlug: String,
    blogTitle: String,
    blogDescription: String,
    blogImage: String,
    blogCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogcategories",
        required: [true, "Blog category is required!"]
    },
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
    }
  },
  { timestamps: true, strict: false }
);

// blogSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });

const Blog = mongoose.model("blogs", blogSchema);
