const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    timelines: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Timeline'}]
})

module.exports = mongoose.model("User", userSchema);