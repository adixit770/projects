const mongoose = require("mongoose");

const categoryTypeSchema = mongoose.Schema(
  {
    categoryTypeName: { type: String, required: true },
    categoryTypeSlug: String,
    categoryTypeImage: String,
    categoryTypeIcon: String,
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

categoryTypeSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.isDeleted && !update.$set.deletedAt) {
    console.log("==============");
    update.$set.deletedAt = new Date();
    delete update.$set.updatedAt
  }
  console.log("new update : ", update);
  next();
});

const categoryTypeModel = mongoose.model("categorytypes", categoryTypeSchema);

const addCategoryTypeData = async (value) => {
  try {
    let customRegex = new RegExp(`^${value.categoryTypeName}$`);
    const isCategoryTypeExist = await categoryTypeModel.findOne({
      categoryTypeName: { $regex: customRegex, $options: "i" },
    });
    if (isCategoryTypeExist) {
      return { status: 409, message: "Category type already exists!" };
    }
    const addResp = await categoryTypeModel.create(value);
    return { status: 201, message: "Category type created successfully." };
  } catch (error) {
    console.log("addCategoryTypeData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getAllCategoryTypeData = async (
  searchQuery = "",
  pageNo,
  dataPerPage
) => {
  try {
    const pipeline = [
      { $sort: { _id: -1 } },
      {
        $match: {
          categoryTypeName: { $regex: searchQuery, $options: "i" },
          isDeleted: false,
        },
      },
    ];
    const totalData = await categoryTypeModel.countDocuments({
      categoryTypeName: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    });

    if (!pageNo || !dataPerPage) {
      const data = await categoryTypeModel.aggregate(pipeline);
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

    const data = await categoryTypeModel.aggregate(paginatedPipeline);

    return {
      status: 200,
      data: { data, totalData, totalPages: Math.ceil(totalData / dataPerPage) },
    };
  } catch (error) {
    console.log("getAllCategoryTypeData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getCategoryTypeDataById = async (id) => {
  try {
    const getResp = await categoryTypeModel.findById(id);
    return { status: 200, data: getResp };
  } catch (error) {
    console.log("getCategoryTypeDataById error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const updateCategoryTypeData = async (id, value, updateStatus = false) => {
  try {
    if (!updateStatus) {
      let customRegex = new RegExp(`^${value.categoryTypeName}$`);
      const isCategoryTypeExist = await categoryTypeModel.findOne({
        _id: { $ne: id },
        categoryTypeName: { $regex: customRegex, $options: "i" },
        isDeleted: false,
      });
      if (isCategoryTypeExist) {
        return { status: 409, message: "Category type already exists!" };
      }
    }
    const updateResp = await categoryTypeModel.findByIdAndUpdate(id, value);
    return {
      status: 200,
      message: `Category type ${
        updateStatus ? "status" : ""
      } updated successfully.`,
    };
  } catch (error) {
    console.log("updateCategoryTypeData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const deleteCategoryTypeData = async (id) => {
  try {
    const deleteResp = await categoryTypeModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return { status: 200, message: "Category type deleted successfully." };
  } catch (error) {
    console.log("deleteCategoryTypeData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = {
  addCategoryTypeData,
  getAllCategoryTypeData,
  getCategoryTypeDataById,
  updateCategoryTypeData,
  deleteCategoryTypeData,
};
