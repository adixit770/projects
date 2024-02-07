const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is required!"],
    },
    categorySlug: String,
    categoryImage: String,
    categoryIcon: String,
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    categoryTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorytypes",
      required: [true, "Category type id is required!"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, strict: false }
);

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.isDeleted && !update.$set.deletedAt) {
    update.$set.deletedAt = new Date();
    delete update.$set.updatedAt;
  }
  next();
});

const categoryModel = mongoose.model("categories", categorySchema);

const addCategoryData = async (value) => {
  try {
    let customRegex = new RegExp(`^${value.categoryName}$`);
    const isCategoryExist = await categoryModel.findOne({
      categoryName: { $regex: customRegex, $options: "i" },
    });
    if (isCategoryExist) {
      return { status: 409, message: "Category already exists!" };
    }
    const addResp = await categoryModel.create(value);
    return { status: 201, message: "Category created successfully." };
  } catch (error) {
    console.log("addCategoryData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getAllCategoryData = async (searchQuery = "", pageNo, dataPerPage) => {
  try {
    const pipeline = [
      { $sort: { _id: -1 } },
      {
        $match: {
          categoryName: { $regex: searchQuery, $options: "i" },
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
        $project: {
          _id: 1,
          categoryName: 1,
          categorySlug: 1,
          categoryImage: 1,
          categoryTypeId: 1,
          categoryTypeName: {
            $arrayElemAt: ["$categoryTypeDetails.categoryTypeName", 0],
          },
          status: 1,
        },
      },
    ];

    const totalData = await categoryModel.countDocuments({
      categoryName: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    });

    if (!pageNo || !dataPerPage) {
      const data = await categoryModel.aggregate(pipeline);
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

    const data = await categoryModel.aggregate(paginatedPipeline);

    return {
      status: 200,
      data: { data, totalData, totalPages: Math.ceil(totalData / dataPerPage) },
    };
  } catch (error) {
    console.log("getAllCategoryData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getCategoryDataById = async (id) => {
  try {
    // const data = await categoryModel
    //   .findById(id)
    //   .populate("categoryTypeId", "categoryTypeName");
    const data = await categoryModel.aggregate([
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
        $project: {
          _id: 1,
          categoryName: 1,
          categorySlug: 1,
          categoryImage: 1,
          categoryTypeId: 1,
          categoryTypeName: {
            $arrayElemAt: ["$categoryTypeDetails.categoryTypeName", 0],
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

const updateCategoryData = async (id, value, updateStatus = false) => {
  try {
    if (!updateStatus) {
      let customRegex = new RegExp(`^${value.categoryTypeName}$`);
      const isCategoryExist = await categoryModel.findOne({
        _id: { $ne: id },
        categoryTypeName: { $regex: customRegex, $options: "i" },
        isDeleted: false,
      });
      if (isCategoryExist) {
        return { status: 409, message: "Category already exists!" };
      }
    }
    const updateResp = await categoryModel.findByIdAndUpdate(id, value);

    return {
      status: 200,
      message: `Category ${updateStatus ? "status" : ""} updated successfully.`,
    };
  } catch (error) {
    console.log("updateCategoryData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const deleteCategoryData = async (id) => {
  try {
    const deleteResp = await categoryModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return { status: 200, message: "Category deleted successfully." };
  } catch (error) {
    console.log("deleteCategoryData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = {
  addCategoryData,
  getAllCategoryData,
  getCategoryDataById,
  updateCategoryData,
  deleteCategoryData,
};
