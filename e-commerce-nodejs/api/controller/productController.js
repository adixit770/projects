const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../modal/productModel");

const addProductController = async (req, res) => {
  try {
    if (!req.body.productName) {
      return res.status(400).send({ message: "Product name is required!" });
    }
    if (req.files) {
      req.body.productThumbnail = req.files[0]?.filename;
    }
    // console.log("product: ", req.body);
    // res.send(req.body)
    const addReq = await addProduct(req.body);
    if (addReq.status !== 500) {
      return res
        .status(addReq.status)
        .send({ message: addReq.message, data: addReq.data });
    }
    throw { message: addReq.message };
  } catch (error) {
    console.log("addProductController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getAllProductController = async (req, res) => {
  try {
    const { searchQuery, pageNo, dataPerPage } = req.query;
    const getReq = await getAllProducts(searchQuery, pageNo, dataPerPage);
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

const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const getReq = await getProductById(id);
    if (getReq.status !== 500) {
      return res
        .status(getReq.status)
        .send({ data: getReq.data, message: getReq.message });
    }
    throw { message: getReq.message };
  } catch (error) {
    console.log("getProductByIdController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const updateProductController = async (req, res) => {
  try {
    //   if (!req.body.brandName) {
    //     return res
    //       .status(400)
    //       .send({ message: "Brand name is required!" });
    //   }
    console.log(req.files);
    const { currentStatus } = req.query;
    if (req.files) {
      req.body.productThumbnail = req.files[0]?.filename;
    }
    const dataForUpdate = currentStatus
      ? { status: currentStatus == "Active" ? "InActive" : "Active" }
      : req.body;
    const updateReq = await updateProduct(
      req.params.id,
      dataForUpdate,
      currentStatus ? true : false
    );
    if (updateReq.status !== 500) {
      return res.status(updateReq.status).send({ message: updateReq.message });
    }
    throw { message: updateReq.message };
  } catch (error) {
    console.log("updateProductController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const deleteReq = await deleteProduct(req.params.id);
    if (deleteReq.status === 200)
      return res.status(200).send({ message: deleteReq.message });
    throw { message: deleteReq.message };
  } catch (error) {
    console.log("deleteProductController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = {
  addProductController,
  getAllProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController
};
