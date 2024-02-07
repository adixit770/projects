const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    subCategoryName: {
      type: String,
      required: [true, "Sub category name is required"],
    },
    subCategorySlug: String,
    subCategoryImage: String,
    subCategoryIcon: String,
    categoryTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorytypes",
      required: [true, "Category type is required!"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "Category is required!"],
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
  { timestamps: true, strict: false }
);

subCategorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.isDeleted && !update.$set.deletedAt) {
    update.$set.deletedAt = new Date();
    delete update.$set.updatedAt;
  }
  next();
});

const subCategory = mongoose.model("sub_categories", subCategorySchema);

const addSubCategoryData = async (value) => {
  try {
    let customRegex = new RegExp(`^${value.subCategoryName}$`);
    const isSubCategoryExist = await subCategory.findOne({
      subCategoryName: { $regex: customRegex, $options: "i" },
    });
    if (isSubCategoryExist) {
      return { status: 409, message: "Sub category already exists!" };
    }
    const addResp = await subCategory.create(value);
    return { status: 201, message: "Sub category created successfully." };
  } catch (error) {
    console.log("addSubCategoryData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getAllSubCategoryData = async (searchQuery = "", pageNo, dataPerPage) => {
  try {
    const pipeline = [
      { $sort: { _id: -1 } },
      {
        $match: {
          subCategoryName: { $regex: searchQuery, $options: "i" },
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "categorytypes",
          localField: "categoryTypeId",
          foreignField: "_id",
          as: "categoryTypeDetails",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $project: {
          _id: 1,
          subCategoryName: 1,
          subCategorySlug: 1,
          subCategoryImage: 1,
          subCategoryIcon: 1,
          categoryTypeId: 1,
          categoryId: 1,
          categoryTypeName: {
            $arrayElemAt: ["$categoryTypeDetails.categoryTypeName", 0],
          },
          categoryName: {
            $arrayElemAt: ["$categoryDetails.categoryName", 0],
          },
          status: 1,
          createdAt: 1,
          deletedAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const totalData = await subCategory.countDocuments({
      subCategoryName: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    });

    if (!pageNo || !dataPerPage) {
      const data = await subCategory.aggregate(pipeline);
      return {
        status: 200,
        data: { data, totalData, totalPages: 1 },
      };
    }

    pageNo = parseInt(pageNo);
    dataPerPage = parseInt(dataPerPage);

    if (
      isNaN(pageNo) ||
      isNaN(dataPerPage) ||
      pageNo <= 0 ||
      dataPerPage <= 0
    ) {
      return { status: 400, message: "Invalid pagination parameters." };
    }

    const paginatedPipeline = [
      ...pipeline,
      { $limit: dataPerPage * pageNo },
      { $skip: dataPerPage * (pageNo - 1) },
    ];

    const data = await subCategory.aggregate(paginatedPipeline);

    return {
      status: 200,
      data: { data, totalData, totalPages: Math.ceil(totalData / dataPerPage) },
    };
  } catch (error) {
    console.log("getAllSubCategoryData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getSubCategoryDataById = async (id) => {
  try {
    // const data = await subCategory
    //   .findById(id)
    //   .populate("categoryTypeId", "categoryTypeName")
    //   .populate("categoryId", "categoryName");

    const data = await subCategory.aggregate([
      {
        $match: { _id : new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "categorytypes",
          localField: "categoryTypeId",
          foreignField: "_id",
          as: "categoryTypeDetails",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $project: {
          _id: 1,
          subCategoryName: 1,
          subCategorySlug: 1,
          subCategoryImage: 1,
          subCategoryIcon: 1,
          categoryTypeId: 1,
          categoryId: 1,
          categoryTypeName: {
            $arrayElemAt: ["$categoryTypeDetails.categoryTypeName", 0],
          },
          categoryName: {
            $arrayElemAt: ["$categoryDetails.categoryName", 0],
          },
          status: 1,
          createdAt: 1,
          deletedAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return { status: 200, data: data.length ? data[0] : {} };
  } catch (error) {
    console.log("getCategoryDataById error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const updateSubCategoryData = async (id, value, updateStatus = false) => {
  try {
    if (!updateStatus) {
      let customRegex = new RegExp(`^${value.subCategoryName}$`);
      const isSubCategoryExist = await subCategory.findOne({
        _id: { $ne: id },
        subCategoryName: { $regex: customRegex, $options: "i" },
        isDeleted: false,
      });
      if (isSubCategoryExist) {
        return { status: 409, message: "Sub category already exists!" };
      }
    }
    const updateResp = await subCategory.findByIdAndUpdate(id, value);

    return {
      status: 200,
      message: `Sub category ${updateStatus ? "status" : ""} updated successfully.`,
    };
  } catch (error) {
    console.log("updateSubCategoryData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const deleteSubCategoryData = async (id) => {
  try {
    const deleteResp = await subCategory.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return { status: 200, message: "Sub category deleted successfully." };
  } catch (error) {
    console.log("deleteSubCategoryData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = {
  addSubCategoryData,
  getAllSubCategoryData,
  getSubCategoryDataById,
  updateSubCategoryData,
  deleteSubCategoryData,
};
