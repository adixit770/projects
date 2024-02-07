const {
  addSubCategoryData,
  getAllSubCategoryData,
  getSubCategoryDataById,
  updateSubCategoryData,
  deleteSubCategoryData,
} = require("../modal/subCategoryModel");

const addSubCategoryController = async (req, res) => {
  try {
    if (!req.body.subCategoryName) {
      return res
        .status(400)
        .send({ message: "Sub category name is required!" });
    }
    const addReq = await addSubCategoryData(req.body);
    return res.status(addReq.status).send({ message: addReq.message });
  } catch (error) {
    console.log("addSubCategoryController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getAllSubCategoryController = async (req, res) => {
  try {
    const { searchQuery, pageNo, dataPerPage } = req.query;
    const getReq = await getAllSubCategoryData(
      searchQuery,
      pageNo,
      dataPerPage
    );
    if (getReq.status === 200) {
      return res.status(200).send(getReq.data);
    }
    if (getReq.status === 400) {
      return res.status(400).send({ message: getReq.message });
    }
    throw { message: getReq.message };
  } catch (error) {
    console.log("getAllSubCategoryController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getSubCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const getReq = await getSubCategoryDataById(id);
    if (getReq.status === 200) {
      return res.status(200).send(getReq.data);
    }
    throw { message: getReq.message };
  } catch (error) {
    console.log("getSubCategoryByIdController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const updateSubCategoryController = async (req, res) => {
  try {
    //   if (!req.body.subCategoryName) {
    //     return res
    //       .status(400)
    //       .send({ message: "Sub category name is required!" });
    //   }
    const { currentStatus } = req.query;
    if (req.files) {
      req.body.subCategoryImage = req.files[0]?.filename;
    }
    const dataForUpdate = currentStatus
      ? { status: currentStatus == "Active" ? "InActive" : "Active" }
      : req.body;
    const updateReq = await updateSubCategoryData(
      req.params.id,
      dataForUpdate,
      currentStatus ? true : false
    );
    if (updateReq.status !== 500) {
      return res.status(updateReq.status).send({ message: updateReq.message });
    }
    throw { message: updateReq.message };
  } catch (error) {
    console.log("updateSubCategoryController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const deleteSubCategoryController = async (req, res) => {
  try {
    const deleteReq = await deleteSubCategoryData(req.params.id);
    if (deleteReq.status === 200)
      return res.status(200).send({ message: deleteReq.message });
    throw { message: deleteReq.message };
  } catch (error) {
    console.log("deleteCategoryController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = {
  addSubCategoryController,
  getAllSubCategoryController,
  getSubCategoryByIdController,
  updateSubCategoryController,
  deleteSubCategoryController,
};
