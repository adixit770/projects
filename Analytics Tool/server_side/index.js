const express = require("express");
const cors = require("cors");
const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');
const { router } = require("./Router/userRoutes");
require("dotenv").config();
require("./dbConnection");
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('/userApi',router)

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`Server started at port: ${process.env.PORT}`);
  });

  console.log(`Worker ${process.pid} started`);
}


