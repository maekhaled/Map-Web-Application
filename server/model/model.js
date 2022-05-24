const mongoose = require('mongoose');

let dataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: [Number, Number],
        required: true,
    }
});

module.exports = mongoose.model('Data', dataSchema)