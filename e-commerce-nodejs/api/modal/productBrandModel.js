const mongoose = require("mongoose");

const productBrandSchema = mongoose.Schema(
  {
    brandName: { type: String, required: [true, "Brand name is required!"] },
    brandSlug: String,
    brandImage: String,
    brandIcon: String,
    categoryTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorytypes",
      required: [true, "Category type is required!"],
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

productBrandSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.isDeleted && !update.$set.deletedAt) {
    update.$set.deletedAt = new Date();
    delete update.$set.updatedAt;
  }
  next();
});


const productBrandModel = mongoose.model("product_brands", productBrandSchema);

const addProductBrandData = async (value) => {
  try {
    let customRegex = new RegExp(`^${value.brandName}$`);
    const isBrandExist = await productBrandModel.findOne({
      brandName: { $regex: customRegex, $options: "i" },
    });
    if (isBrandExist) {
      return { status: 409, message: "Brand Name already exists!" };
    }
    const addResp = await productBrandModel.create(value);
    return { status: 201, message: "Brand created successfully." };
  } catch (error) {
    console.log("addProductBrandData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getAllBrandData = async (searchQuery = "", pageNo, dataPerPage) => {
  try {
    const pipeline = [
      { $sort: { _id: -1 } },
      {
        $match: {
          brandName: { $regex: searchQuery, $options: "i" },
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
          brandName: 1,
          brandSlug: 1,
          brandImage: 1,
          categoryTypeId: 1,
          categoryTypeName: {
            $arrayElemAt: ["$categoryTypeDetails.categoryTypeName", 0],
          },
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    const totalData = await productBrandModel.countDocuments({
      brandName: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    });

    if (!pageNo || !dataPerPage) {
      const data = await productBrandModel.aggregate(pipeline);
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

    const data = await productBrandModel.aggregate(paginatedPipeline);

    return {
      status: 200,
      data: { data, totalData, totalPages: Math.ceil(totalData / dataPerPage) },
    };
  } catch (error) {
    console.log("getAllBrandData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getBrandDataById = async (id) => {
  try {
    const getResp = await productBrandModel.findById(id).populate("categoryTypeId","categoryTypeName");
    const data = JSON.parse(JSON.stringify(getResp));
    data.categoryType = data.categoryTypeId;
    delete data.categoryTypeId;
    return { status: 200, data };
  } catch (error) {
    console.log("getBrandDataById error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const updateBrandData = async (id, value, updateStatus = false) => {
  try {
    if (!updateStatus) {
      let customRegex = new RegExp(`^${value.brandName}$`);
      const isBrandExist = await productBrandModel.findOne({
        _id: { $ne: id },
        brandName: { $regex: customRegex, $options: "i" },
        isDeleted: false,
      });
      if (isBrandExist) {
        return { status: 409, message: "Brand name already exists!" };
      }
    }
    const updateResp = await productBrandModel.findByIdAndUpdate(id, value);
    console.log("updateResp>> ", updateResp);
    return {
      status: 200,
      message: `Brand ${
        updateStatus ? "status" : ""
      } updated successfully.`,
    };
  } catch (error) {
    console.log("updateBrandData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const deleteBrandData = async (id) => {
  try {
    const deleteResp = await productBrandModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return { status: 200, message: "Brand deleted successfully." };
  } catch (error) {
    console.log("deleteBrandData error: ", error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = {
  addProductBrandData,
  getAllBrandData,
  updateBrandData,
  deleteBrandData,
  getBrandDataById
};
