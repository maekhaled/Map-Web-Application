const Model = require('../model/model');
const express = require('express');
const router = express.Router()

module.exports = router;

//Post Method
router.post('/post', async (request, response) => {
    const data = new Model({
        title: request.body.title,
        location: request.body.location,
        objectType: request.body.objectType
    })

    try{
        const savedData = await data.save();
        response.status(200).json(savedData)
    }
    catch(error){
        response.status(400).json({message: error.message})
    }
})

 //Get all Method
router.get('/getAll', async (request, response) => {
    try{
        const data = await Model.find();
        response.json(data)    }
    catch(error){
        response.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async (request, response) => {
    try{
        const data = await Model.findById(request.params.id);
        response.json(data)
    }
    catch(error){
        response.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/update/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const updatedData = request.body;
        const options = { new: true };

        const results = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        response.send(results)
    }
    catch (error) {
        response.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (request, response) => {
    try{
        console.log("im here");
        const id = request.params.id;
        console.log(id);
        const data = await Model.findByIdAndDelete(id)
        response.send('${data.title} object has been deleted.')
        console.log("deleted");
    }
    catch(error){
        response.status(400).json({message: error.message})
    }
})

//Delete All
router.delete('/deleteAll', async (request, response) => {
    try{
        const id = request.params.id;
        const data = await Model.deleteMany()
        response.send('${data.title} object has been deleted.')
    }
    catch(error){
        response.status(400).json({message: error.message})
    }
})