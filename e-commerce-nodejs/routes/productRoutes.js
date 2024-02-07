const express = require("express");
const { verifyToken, uploadProductImage } = require("../api/middleware");
const {
  addBrandController,
  getAllBrandController,
  updateBrandController,
  deleteBrandController,
  getBrandByIdController,
} = require("../api/controller/productBrandController");
const {
  addProductController,
  getAllProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} = require("../api/controller/productController");
const {
  addProductVariantController,
  getAllProductVariantController,
} = require("../api/controller/productVariantController");

const productRoutes = express.Router();

//////////////////////////////////////////////////////////////
///////////////******** Brand routes ********/////////////////
//////////////////////////////////////////////////////////////

productRoutes.post(
  "/addBrand",
  verifyToken,
  uploadProductImage,
  addBrandController
);
productRoutes.get("/getAllBrand", verifyToken, getAllBrandController);
productRoutes.get("/getBrandById/:id", verifyToken, getBrandByIdController);

productRoutes.put(
  "/updateBrand/:id",
  verifyToken,
  uploadProductImage,
  updateBrandController
);

productRoutes.use(
  "/brandImage",
  verifyToken,
  express.static("fileUpload/productImages/brand")
);

productRoutes.delete("/deleteBrand/:id", verifyToken, deleteBrandController);

/////////////////////////////////////////////////////////////////
///////////////******** Product routes ********/////////////////
///////////////////////////////////////////////////////////////

productRoutes.post(
  "/addProduct",
  verifyToken,
  uploadProductImage,
  addProductController
);

productRoutes.get("/getAllProducts", getAllProductController);

productRoutes.get(
  "/getProductDetails/:id",
  // verifyToken,
  getProductByIdController
);

productRoutes.put(
  "/updateProduct/:id",
  verifyToken,
  uploadProductImage,
  updateProductController
);

productRoutes.delete(
  "/deleteProduct/:id",
  verifyToken,
  deleteProductController
);

productRoutes.use(
  "/productImage",
  express.static("fileUpload/productImages/product")
);

////////////////////////////////////////////////////////////////////////
///////////////******** Product Variant routes ********/////////////////
////////////////////////////////////////////////////////////////////////

productRoutes.post(
  "/addProductVariant",
  verifyToken,
  uploadProductImage,
  addProductVariantController
);

productRoutes.get(
  "/getVariantListing/:product_id",
  getAllProductVariantController
);

module.exports = { productRoutes };
