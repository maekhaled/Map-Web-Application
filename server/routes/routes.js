const Model = require("../model/model");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { updateMany } = require("../model/model");
module.exports = router;

//Post Method
router.post("/post", async (request, response) => {
  const data = new Model({
    title: request.body.title,
    location: request.body.location,
    objectType: request.body.objectType,
  });
  try {
    const savedData = await data.save();
    response.status(200).json(savedData);
    console.log(savedData);
  } catch (error) {
    console.log(error.message);
    response.status(400).json({ message: error.message });
  }
});

//Get all Method
router.get("/getAll", async (request, response) => {
  try {
    const data = await Model.find();
    // data.forEach((obj) => {
    //   console.log(obj.id);
    // });
    response.json(data);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/getOne/:id", async (request, response) => {
  try {
    const data = await Model.findById(request.params.id);
    response.json(data);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/update/:id", async (request, response) => {
  try {
    const id = mongoose.Types.ObjectId(request.params.id);
    const updatedData = request.body;
    const options = { new: true };
    const results = await Model.findByIdAndUpdate(id, updatedData, options);

    console.log("Object with _id:" + id + " updated ->" + results);

    response.send(results);
  } catch (error) {
    console.log(error.message);
    response.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/delete/:id", async (request, response) => {
  try {
    const id = mongoose.Types.ObjectId(request.params.id);
    const data = await Model.findByIdAndDelete(id);
    console.log("Object with _id:" + id + " deleted");
  } catch (error) {
    console.log(error.message);
    response.status(400).json({ message: error.message });
  }
});

//Delete All
router.delete("/deleteAll", async (request, response) => {
  try {
    const id = request.params.id;
    const data = await Model.deleteMany();
    response.send("${data.title} object has been deleted.");
  } catch (error) {
    console.log(error.message);
    response.status(400).json({ message: error.message });
  }
});
