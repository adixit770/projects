const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productName: { type: String, required: true },
    // productShortName: String,
    slug: String,
    productThumbnail: String,
    productImages: [String],
    productCategoryTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorytypes",
      required: [true, "Category type is required!"],
    },
    productCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "Category is required!"],
    },
    productSubCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sub_categories",
      required: [true, "Sub-category is required!"],
    },
    productBrandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_brands",
      required: [true, "Brand is required!"],
    },
    stockKeepingUnit: String,
    productPrice: {
      type: Number,
      required: [true, "Product price is required!"],
    },
    productOfferPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Offer price must be less than the actual price.",
      },
    },
    productStock: {
      type: Number,
      required: [true, "Product stock is required!"],
    },
    productWeight: {
      type: Number,
      required: [true, "Product weight is required!"],
    },
    productTag: {
      type: String,
      required: [true, "Product tag is required!"],
    },
    productShortDescription: {
      type: String,
      // required: [true, "Product short description is required!"],
    },
    productDescription: {
      type: String,
      required: [true, "Product description is required!"],
    },
    productType: [String],
    productSpecification: [
      {
        specificationKey: String,
        specificationDescription: String,
      },
    ],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sellers",
      // required: [true, "Seller is required!"],
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
      // required: [true, "Shop is required!"],
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
    productExpiryDate: {
      type: Date,
      required: true,
    },
    productManufacturingDate: {
      type: Date,
      required: true,
    },
    productVariants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "product_variants"
    }
  },
  { timestamps: true, strict: false }
);

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.isDeleted && !update.$set.deletedAt) {
    update.$set.deletedAt = new Date();
    delete update.$set.updatedAt;
  }
  next();
});

const Product = mongoose.model("products", productSchema);

const ObjectId = mongoose.Types.ObjectId;

const addProduct = async (value) => {
  try {
    let customRegex = new RegExp(`^${value.productName}$`);
    const isProductExist = await Product.findOne({
      productName: { $regex: customRegex, $options: "i" },
    });
    if (isProductExist) {
      return { status: 409, message: "Product already exists!" };
    }
    const addResp = await Product.create(value);
    console.log("addProduct brand resp ", addResp);
    return {
      status: 201,
      message: "Product created successfully.",
      data: addResp,
    };
  } catch (error) {
    console.log("addProduct error: ", error.message);
    if ((error.name = "ValidationError")) {
      return { status: 400, message: error.message };
    }
    return { status: 500, message: error.message };
  }
};

const getAllProducts = async (searchQuery = "", pageNo, dataPerPage) => {
  try {
    const pipeline = [
      { $sort: { _id: -1 } },
      {
        $match: {
          productName: { $regex: searchQuery, $options: "i" },
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "categorytypes",
          localField: "productCategoryTypeId",
          foreignField: "_id",
          as: "categoryTypeDetails",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "productCategoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "sub_categories",
          localField: "productSubCategoryId",
          foreignField: "_id",
          as: "subCategoryDetails",
        },
      },
      {
        $lookup: {
          from: "product_brands",
          localField: "productBrandId",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      // {
      //   $project: {
      //     brandName: 1,
      //     brandSlug: 1,
      //     brandImage: 1,
      //     categoryTypeId: 1,
      //     categoryTypeName: {
      //       $arrayElemAt: ["$categoryTypeDetails.categoryTypeName", 0],
      //     },
      //     status: 1,
      //     createdAt: 1,
      //     updatedAt: 1,
      //   },
      // },
    ];
    const totalData = await Product.countDocuments({
      productName: { $regex: searchQuery, $options: "i" },
      isDeleted: false,
    });

    if (!pageNo || !dataPerPage) {
      const data = await Product.aggregate(pipeline);
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

    const data = await Product.aggregate(paginatedPipeline);

    return {
      status: 200,
      data: { data, totalData, totalPages: Math.ceil(totalData / dataPerPage) },
    };
  } catch (error) {
    console.log("getAllProducts error: ", error.message);
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
    const getResp = await Product
      .findById(id)
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
      })
      .populate({
        path: "productVariants",
        // select: ["brandName", "brandSlug"],
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

    // const getResp = await Product.aggregate(pipeline);

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
      const isProductExist = await Product.findOne({
        _id: { $ne: id },
        productName: { $regex: customRegex, $options: "i" },
        isDeleted: false,
      });
      if (isProductExist) {
        return { status: 409, message: "Product name already exists!" };
      }
    }
    const updateResp = await Product.findByIdAndUpdate(id, value);
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
    const deleteResp = await Product.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return { status: 200, message: "Product deleted successfully." };
  } catch (error) {
    console.log("deleteProduct error: ", error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  Product
};
