const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timestampSchema = new Schema({
    time: { type: String, required: true },
    name: { type: String, required: true},
    location: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    temperature: { type: String, required: true },
    weatherCode: { type: Number, required: true },
    conditions: { type: String, required: true }
});

module.exports = mongoose.model('Timestamp', timestampSchema);