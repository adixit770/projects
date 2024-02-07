const mongoose = require("mongoose");

const productVariantSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: [true, "Product id is required"],
    },
    variantName: { type: String, required: [true, "Variant Name is required"] },
    variantType: {
      type: String,
      enum: ["Size", "Color"],
      required: [true, "Variant type is required"],
    },
    variantImage: String,
    variantSize: String,
    variantColor: String,
    variantWeight: Number,
    dimensions: String,
    isRegularPrice: String,
    variantPrice: Number,
    salePrice: Number,
    stock: Number,
    isDefault: {
      type: Boolean,
      default: false,
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
    },
  },
  { timestamps: true, strict: false }
);

productVariantSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.isDeleted && !update.$set.deletedAt) {
    update.$set.deletedAt = new Date();
    delete update.$set.updatedAt;
  }
  next();
});

const ProductVariant = mongoose.model("product_variants", productVariantSchema);

const ObjectId = mongoose.Types.ObjectId;

const addProductVariant = async (value) => {
  try {
    let customRegex = new RegExp(`^${value.variantName}$`);
    const isVariantExist = await ProductVariant.findOne({
      variantName: { $regex: customRegex, $options: "i" },
    });
    if (isVariantExist) {
      return { status: 409, message: "Variant already exists!" };
    }
    const addResp = await ProductVariant.create(value);
    return {
      status: 201,
      message: "Product Variant created successfully.",
      data: addResp,
    };
  } catch (error) {
    console.log("addProductVariant error: ", error.message);
    if ((error.name = "ValidationError")) {
      return { status: 400, message: error.message };
    }
    return { status: 500, message: error.message };
  }
};

const getAllProductVariants = async (
  productId,
  searchQuery = "",
  pageNo,
  dataPerPage
) => {
  try {
    const pipeline = [
      { $sort: { _id: -1 } },
      {
        $match: {
          productId: new ObjectId(productId),
          variantName: { $regex: searchQuery, $options: "i" },
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          variantName: 1,
          variantType: 1,
          variantImage: 1,
          variantSize: 1,
          variantColor: 1,
          variantWeight: 1,
          dimensions: 1,
          isRegularPrice: 1,
          variantPrice: 1,
          salePrice: 1,
          stock: 1,
          isDefault: 1,
          status: 1,
          isDeleted: 1,
          deletedAt: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          productDetails: {
            $arrayElemAt: ["$productDetails", 0]
          },
        },
      },
      {
        $project: {
          variantName: 1,
          variantType: 1,
          variantImage: 1,
          variantSize: 1,
          variantColor: 1,
          variantWeight: 1,
          dimensions: 1,
          isRegularPrice: 1,
          variantPrice: 1,
          salePrice: 1,
          stock: 1,
          isDefault: 1,
          status: 1,
          isDeleted: 1,
          deletedAt: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          productDetails: {
            _id: 1,
            productName: 1,
            slug: 1,
            productPrice: 1,
          },
        },
      },
    ] ;
    const totalData = await ProductVariant.countDocuments({
      variantName: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    });

    if (!pageNo || !dataPerPage) {
      const data = await ProductVariant.aggregate(pipeline);
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

    const data = await ProductVariant.aggregate(paginatedPipeline);

    return {
      status: 200,
      data: { data, totalData, totalPages: Math.ceil(totalData / dataPerPage) },
    };
  } catch (error) {
    console.log("getAllProductVariants error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const getProductById = async (id) => {
  try {
    const renameFields = {
      productCategoryTypeId: "productCategoryType",
      productCategoryId: "productCategory",
      productSubCategoryId: "productSubCategory",
      productBrandId: "productBrand",
    };
    const getResp = await ProductVariant.findById(id)
      .populate({
        path: "productCategoryTypeId",
        select: ["categoryTypeName", "categoryTypeSlug"],
        options: { lean: true },
      })
      .populate({
        path: "productCategoryId",
        select: ["categoryName", "categorySlug"],
        options: { lean: true },
      })
      .populate({
        path: "productSubCategoryId",
        select: ["subCategoryName", "subCategorySlug"],
        options: { lean: true },
      })
      .populate({
        path: "productBrandId",
        select: ["brandName", "brandSlug"],
        options: { lean: true },
      });
    const data = JSON.parse(JSON.stringify(getResp));
    for (const oldField in renameFields) {
      const newField = renameFields[oldField];
      data[newField] = data[oldField];
      delete data[oldField];
    }
    // const pipeline = [
    //   {
    //     $match: {
    //       _id: new ObjectId(id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "categorytypes",
    //       localField: "productCategoryTypeId",
    //       foreignField: "_id",
    //       as: "categoryTypeDetails",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "productCategoryId",
    //       foreignField: "_id",
    //       as: "categoryDetails",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "sub_categories",
    //       localField: "productSubCategoryId",
    //       foreignField: "_id",
    //       as: "subCategoryDetails",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "product_brands",
    //       localField: "productBrandId",
    //       foreignField: "_id",
    //       as: "brandDetails",
    //     },
    //   },
    //   // {
    //   //   $project: {
    //   //     brandName: 1,
    //   //     brandSlug: 1,
    //   //     brandImage: 1,
    //   //     categoryTypeId: 1,
    //   //     categoryTypeName: {
    //   //       $arrayElemAt: ["$categoryTypeDetails.categoryTypeName", 0],
    //   //     },
    //   //     status: 1,
    //   //     createdAt: 1,
    //   //     updatedAt: 1,
    //   //   },
    //   // },
    // ];

    // const getResp = await ProductVariant.aggregate(pipeline);

    if (getResp) {
      return { status: 200, data };
    } else {
      return { status: 404, message: "Product not found!" };
    }
  } catch (error) {
    console.log("getProductById error: ", error.message);
    return { status: 500, message: error.message };
  }
};

const updateProduct = async (id, value, updateStatus = false) => {
  try {
    if (!updateStatus) {
      let customRegex = new RegExp(`^${value.productName}$`);
      const isProductExist = await ProductVariant.findOne({
        _id: { $ne: id },
        productName: { $regex: customRegex, $options: "i" },
        isDeleted: false,
      });
      if (isProductExist) {
        return { status: 409, message: "Product name already exists!" };
      }
    }
    const updateResp = await ProductVariant.findByIdAndUpdate(id, value);
    return {
      status: 200,
      message: `Product ${updateStatus ? "status" : ""} updated successfully.`,
    };
  } catch (error) {
    console.log("updateProduct error: ", error.message);
    if ((error.name = "ValidationError")) {
      return { status: 400, message: error.message };
    }
    return { status: 500, message: error.message };
  }
};

const deleteProduct = async (id) => {
  try {
    const deleteResp = await ProductVariant.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return { status: 200, message: "Product deleted successfully." };
  } catch (error) {
    console.log("deleteProduct error: ", error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = {
  addProductVariant,
  getAllProductVariants,
  updateProduct,
  deleteProduct,
  getProductById,
};
