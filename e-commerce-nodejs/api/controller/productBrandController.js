const {
  addProductBrandData,
  getAllBrandData,
  updateBrandData,
  deleteBrandData,
  getBrandDataById,
} = require("../modal/productBrandModel");

const addBrandController = async (req, res) => {
  try {
    if (!req.body.brandName) {
      return res.status(400).send({ message: "Brand name is required!" });
    }
    if (req.files) {
      req.body.brandImage = req.files[0]?.filename;
    }
    const addReq = await addProductBrandData(req.body);
    if (addReq.status !== 500) {
      return res.status(addReq.status).send({ message: addReq.message });
    }
    throw { message: addReq.message };
  } catch (error) {
    console.log("addBrandController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getAllBrandController = async (req, res) => {
  try {
    const { searchQuery, pageNo, dataPerPage } = req.query;
    const getReq = await getAllBrandData(searchQuery, pageNo, dataPerPage);
    if (getReq.status === 200) {
      return res.status(200).send(getReq.data);
    }
    if (getReq.status === 400) {
      return res.status(400).send({ message: getReq.message });
    }
    throw { message: getReq.message };
  } catch (error) {
    console.log("getAllBrandController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getBrandByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const getReq = await getBrandDataById(id);
    if (getReq.status === 200) {
      return res.status(200).send(getReq.data);
    }
    throw { message: getReq.message };
  } catch (error) {
    console.log("getCategoryTypeByIdController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const updateBrandController = async (req, res) => {
  try {
    //   if (!req.body.brandName) {
    //     return res
    //       .status(400)
    //       .send({ message: "Brand name is required!" });
    //   }
    const { currentStatus } = req.query;
    if (req.files) {
      req.body.brandImage = req.files[0]?.filename;
    }
    const dataForUpdate = currentStatus
      ? { status: currentStatus == "Active" ? "InActive" : "Active" }
      : req.body;
    const updateReq = await updateBrandData(
      req.params.id,
      dataForUpdate,
      currentStatus ? true : false
    );
    if (updateReq.status !== 500) {
      return res.status(updateReq.status).send({ message: updateReq.message });
    }
    throw { message: updateReq.message };
  } catch (error) {
    console.log("updateBrandController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const deleteBrandController = async (req, res) => {
  try {
    const deleteReq = await deleteBrandData(req.params.id);
    if (deleteReq.status === 200)
      return res.status(200).send({ message: deleteReq.message });
    throw { message: deleteReq.message };
  } catch (error) {
    console.log("deleteBrandController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = {
  addBrandController,
  getAllBrandController,
  updateBrandController,
  deleteBrandController,
  getBrandByIdController,
};
