const {
  addCategoryData,
  getAllCategoryData,
  getCategoryDataById,
  updateCategoryData,
  deleteCategoryData,
} = require("../modal/categoryModel");

const addCategoryController = async (req, res) => {
  try {
    if (!req.body.categoryName) {
      return res.status(400).send({ message: "Category name is required!" });
    }
    const addReq = await addCategoryData(req.body);
    if (addReq.status !== 500) {
      return res.status(addReq.status).send({ message: addReq.message });
    }
    throw { message: addReq.message };
  } catch (error) {
    console.log("addCategoryController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getAllCategoryController = async (req, res) => {
  try {
    const { searchQuery, pageNo, dataPerPage } = req.query;
    const getReq = await getAllCategoryData(searchQuery, pageNo, dataPerPage);
    if (getReq.status === 200) {
      return res.status(200).send(getReq.data);
    }
    if (getReq.status === 400) {
      return res.status(400).send({ message: getReq.message });
    }
    throw { message: getReq.message };
  } catch (error) {
    console.log("getAllCategoryController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const getReq = await getCategoryDataById(id);
    if (getReq.status === 200) {
      return res.status(200).send(getReq.data);
    }
    throw { message: getReq.message };
  } catch (error) {
    console.log("getCategoryByIdController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    //   if (!req.body.categoryName) {
    //     return res
    //       .status(400)
    //       .send({ message: "Category name is required!" });
    //   }
    const { currentStatus } = req.query;
    if (req.files) {
      req.body.categoryImage = req.files[0]?.filename;
    }
    const dataForUpdate = currentStatus
      ? { status: currentStatus == "Active" ? "InActive" : "Active" }
      : req.body;
    const updateReq = await updateCategoryData(
      req.params.id,
      dataForUpdate,
      currentStatus ? true : false
    );
    if (updateReq.status !== 500) {
      return res.status(updateReq.status).send({ message: updateReq.message });
    }
    throw { message: updateReq.message };
  } catch (error) {
    console.log("updateCategoryController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const deleteReq = await deleteCategoryData(req.params.id);
    if (deleteReq.status === 200)
      return res.status(200).send({ message: deleteReq.message });
    throw { message: deleteReq.message };
  } catch (error) {
    console.log("deleteCategoryController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};
module.exports = {
  addCategoryController,
  getAllCategoryController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
};
