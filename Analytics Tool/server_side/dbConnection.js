const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("database connected successfully...");
  })
  .catch((err) => {
    console.log("database connectivity error: ", err);
  });

