const { updateProduct, Product } = require("../modal/productModel");
const {
  addProductVariant,
  getAllProductVariants,
} = require("../modal/productVariantModel");

const addProductVariantController = async (req, res) => {
  try {
    if (!req.body.variantName) {
      return res.status(400).send({ message: "Variant name is required!" });
    }
    if (req.files) {
      req.body.variantImage = req.files[0]?.filename;
    }
    const addReq = await addProductVariant(req.body);
    if (addReq.status === 201) {
      const variant = addReq.data;
      console.log("variant: ", variant);
      const addVariantIdInProductReq = await Product.findByIdAndUpdate(
        variant.productId,
        {
          $push: { productVariants: variant._id },
        }
      );
    }
    if (addReq.status !== 500) {
      return res
        .status(addReq.status)
        .send({ message: addReq.message, data: addReq.data });
    }
    throw { message: addReq.message };
  } catch (error) {
    console.log("addProductVariantController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

const getAllProductVariantController = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { searchQuery, pageNo, dataPerPage } = req.query;
    const getReq = await getAllProductVariants(
      product_id,
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
    console.log("getAllProductVariantController Error:  ", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = {
  addProductVariantController,
  getAllProductVariantController,
};
