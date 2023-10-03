const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Position = new Schema({
    datasetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dataset'
    },
    position: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Position', Position, 'Position');