const express = require("express");
const { verifyToken, uploadCategoryImage } = require("../api/middleware");
const {
  addCategoryTypeController,
  getAllCategoryTypeController,
  getCategoryTypeByIdController,
  updateCategoryTypeController,
  deleteCategoryTypeController,
} = require("../api/controller/categoryTypeController");
const {
  addCategoryController,
  getAllCategoryController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require("../api/controller/categoryController");
const {
  addSubCategoryController,
  getAllSubCategoryController,
  getSubCategoryByIdController,
  updateSubCategoryController,
  deleteSubCategoryController,
} = require("../api/controller/subCategoryController");

const categoryRoutes = express.Router();

////////////////////////////////////////////////////////
//****************Category Type routes****************//
////////////////////////////////////////////////////////

categoryRoutes.post(
  "/addCategoryType",
  verifyToken,
  uploadCategoryImage,
  addCategoryTypeController
);
categoryRoutes.get(
  "/getAllCategoryTypes",
  verifyToken,
  getAllCategoryTypeController
);
categoryRoutes.get(
  "/getCategoryTypeById/:id",
  verifyToken,
  getCategoryTypeByIdController
);

categoryRoutes.put(
  "/updateCategoryType/:id",
  verifyToken,
  uploadCategoryImage,
  updateCategoryTypeController
);

categoryRoutes.delete(
  "/deleteCategoryType/:id",
  verifyToken,
  deleteCategoryTypeController
);

categoryRoutes.use(
  "/categoryTypeImage",
  verifyToken,
  express.static("fileUpload/categoryImages/categoryType")
);

///////////////////////////////////////////////////
//****************Category routes****************//
///////////////////////////////////////////////////

categoryRoutes.post(
  "/addCategory",
  verifyToken,
  uploadCategoryImage,
  addCategoryController
);
categoryRoutes.get("/getAllCategories", verifyToken, getAllCategoryController);

categoryRoutes.get(
  "/getCategoryById/:id",
  verifyToken,
  getCategoryByIdController
);

categoryRoutes.put(
  "/updateCategoryById/:id",
  verifyToken,
  updateCategoryController
);

categoryRoutes.delete(
  "/deleteCategory/:id",
  verifyToken,
  deleteCategoryController
);

///////////////////////////////////////////////////////
//****************Sub category routes****************//
///////////////////////////////////////////////////////

categoryRoutes.post("/addSubCategory", verifyToken, addSubCategoryController);
categoryRoutes.get(
  "/getAllSubCategories",
  verifyToken,
  getAllSubCategoryController
);

categoryRoutes.get(
  "/getSubCategoryById/:id",
  verifyToken,
  getSubCategoryByIdController
);

categoryRoutes.put(
  "/updateSubCategoryById/:id",
  verifyToken,
  updateSubCategoryController
);

categoryRoutes.delete(
  "/deleteSubCategory/:id",
  verifyToken,
  deleteSubCategoryController
);

module.exports = { categoryRoutes };
