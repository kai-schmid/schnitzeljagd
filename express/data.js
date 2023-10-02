const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const JSONData = new Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    jsonArray: {
        type: Array,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

});

module.exports = mongoose.model('JSONData', JSONData, 'JSONData');