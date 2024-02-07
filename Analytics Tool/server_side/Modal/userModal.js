const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {type:String,required: true,},
    email: {type:String,required: true,},
    password: {type:String,required: true,},
  },
   
  { timestamps: true, strict: false }
);

const userModel = mongoose.model("users", userSchema);

module.exports={userModel}