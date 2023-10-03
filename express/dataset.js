const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Dataset = new Schema({
    name: {
        type: String,
        unique: false,
        required: true,
    },
    jsonArray: {
        type: Array,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

module.exports = mongoose.model('Dataset', Dataset, 'Dataset');