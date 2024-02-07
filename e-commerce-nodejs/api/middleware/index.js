const jwt = require("jsonwebtoken");
const { adminModel } = require("../modal/adminModal");
const multer = require("multer");

//////////////////////////////////////////////
//****************Verify Token**************//
//////////////////////////////////////////////
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({
      message: "Token Required",
    });

  jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, user) => {
    if (err) {
      return res.status(401).send({
        message: "Invalid Token",
      });
    }
    const { _id, role } = user;
    if (role === "Admin") {
      const admin = await adminModel.findById(_id);
      if (!admin) {
        return res.status(401).send({
          message: "User not found!",
        });
      }
    }
    req.user = { _id, role };
    next();
  });
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

const fileType = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const fileFilter = (req, file, callback) => {
  if (fileType.includes(file.mimetype)) {
    callback(null, true);
  } else {
    const error = new Error("Not a valid format");
    error.status = 400;
    callback(error, false);
  }
};

///////////////////////////////////////////////////////////
////****************Upload Profile Image***************////
///////////////////////////////////////////////////////////
const profilestorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadFolder =
      file.fieldname == "admin_image"
        ? "admin"
        : file.fieldname == "vendor_image"
        ? "vendor"
        : "customer";
    callback(null, `./fileUpload/profileImages/${uploadFolder}`);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const uploadProfileImage = multer({
  storage: profilestorage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // Limiting file size to 1MB
  },
}).any();

const uploadProfileImageByRole = (req, res, next) => {
  uploadProfileImage(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("uploadProfileImageByRole multer error>> ", err);
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.log("uploadProfileImageByRole error>> ", err);
      return res.status(err.status || 500).json({ message: err.message });
    }
    next();
  });
};

////////////////////////////////////////////////////////////
/////*****************Category Image*****************///////
////////////////////////////////////////////////////////////
const categoryStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadFolder =
      file.fieldname == "categoryTypeImage"
        ? "categoryType"
        : file.fieldname == "categoryImage"
        ? "category"
        : "sub-Category";
    callback(null, `./fileUpload/categoryImages/${uploadFolder}`);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const uploadCategory = multer({
  storage: categoryStorage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // Limiting file size to 1MB
  },
}).any();

const uploadCategoryImage = (req, res, next) => {
  uploadCategory(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("uploadCategoryImage multer error>> ", err);
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.log("uploadCategoryImage error>> ", err);
      return res.status(err.status || 500).json({ message: err.message });
    }
    next();
  });
};

///////////////////////////////////////////////////////////
/////*****************Product Image*****************///////
///////////////////////////////////////////////////////////
const productStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadFolder = file.fieldname == "brandImage" ? "brand" : "product";
    callback(null, `./fileUpload/productImages/${uploadFolder}`);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const uploadProduct = multer({
  storage: productStorage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // Limiting file size to 1MB
  },
}).any();

const uploadProductImage = (req, res, next) => {
  uploadProduct(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("uploadProductImage multer error>> ", err);
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.log("uploadProductImage error>> ", err);
      return res.status(err.status || 500).json({ message: err.message });
    }
    next();
  });
};
module.exports = {
  verifyToken,
  uploadProfileImageByRole,
  uploadCategoryImage,
  uploadProductImage,
};
