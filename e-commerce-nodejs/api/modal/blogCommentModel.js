const mongoose = require("mongoose");

const blogCommentSchema = mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "blogs" },
    commentByName: String,
    commentByEmail: String,
    comment: String,
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

// blogCommentSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.isDeleted && !update.$set.deletedAt) {
//     update.$set.deletedAt = new Date();
//     delete update.$set.updatedAt;
//   }
//   next();
// });

const BlogComment = mongoose.model("blogs", blogCommentSchema);
