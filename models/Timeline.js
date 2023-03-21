const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timelineSchema = new Schema({
    date: { type: String, required: true},
    timestamps: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Timestamp'}],
    author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Timeline', timelineSchema);