const mongoose = require("mongoose");

const VisitSchema = mongoose.Schema(
    { dataId: String, ipAddress: String},
   
  { timestamps: true, strict: false }
);

const visitModel = mongoose.model("VisitUsers", VisitSchema);

module.exports={visitModel}