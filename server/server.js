require("dotenv").config();
console.log(process.env.DATABASE_URL);
const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
const bodyParser = require("body-parser");
const cors = require("cors");

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api", require("./routes/routes"));

app.listen(5000, () => {
  console.log(`Server Started at ${5000}`);
});
