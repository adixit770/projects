const {
  addCategoryTypeData,
  getAllCategoryTypeData,
  getCategoryTypeDataById,
  updateCategoryTypeData,
  deleteCategoryTypeData,
} = require("../modal/categoryTypeModel");

const addCategoryTypeController = async (req, res) => {
  try {
    if (!req.body.categoryTypeName) {
      return res
        .status(400)
        .send({ message: "Category-type name is required!" });
    }
    if (req.files) {
      req.body.categoryTypeImage = req.files[0]?.filename;
    }
    const addReq = await addCategoryTypeData(req.body);
    if (addReq.status !== 500) {
      return res.status(addReq.status).send({ message: addReq.message });
    }
    throw { message: addReq.message };
  } catch (error) {
    console.log("addCategoryTypeController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getAllCategoryTypeController = async (req, res) => {
  try {
    const { searchQuery, pageNo, dataPerPage } = req.query;
    const getReq = await getAllCategoryTypeData(
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
    console.log("getAllCategoryTypeController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getCategoryTypeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const getReq = await getCategoryTypeDataById(id);
    if (getReq.status === 200) {
      return res.status(200).send(getReq.data);
    }
    throw { message: getReq.message };
  } catch (error) {
    console.log("getCategoryTypeByIdController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};
const updateCategoryTypeController = async (req, res) => {
  try {
    //   if (!req.body.categoryTypeName) {
    //     return res
    //       .status(400)
    //       .send({ message: "Category-type name is required!" });
    //   }
    const { currentStatus } = req.query;
    if (req.files) {
      req.body.categoryTypeImage = req.files[0]?.filename;
    }
    const dataForUpdate = currentStatus
      ? { status: currentStatus == "Active" ? "InActive" : "Active" }
      : req.body;
    const updateReq = await updateCategoryTypeData(
      req.params.id,
      dataForUpdate,
      currentStatus ? true : false
    );
    if (updateReq.status !== 500) {
      return res.status(updateReq.status).send({ message: updateReq.message });
    }
    throw { message: updateReq.message };
  } catch (error) {
    console.log("updateCategoryTypeController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const deleteCategoryTypeController = async (req, res) => {
  try {
    const deleteReq = await deleteCategoryTypeData(req.params.id);
    if (deleteReq.status === 200)
      return res.status(200).send({ message: deleteReq.message });
    throw { message: deleteReq.message };
  } catch (error) {
    console.log("deleteCategoryTypeController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = {
  addCategoryTypeController,
  getAllCategoryTypeController,
  getCategoryTypeByIdController,
  updateCategoryTypeController,
  deleteCategoryTypeController,
};
