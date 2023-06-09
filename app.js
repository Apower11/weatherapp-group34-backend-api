const userRoutes = require("./routes/user-routes");
const timelineRoutes = require("./routes/timeline-routes");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

console.log(123);
console.log(process.env.DB_NAME);

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
require('dotenv').config();
console.log("CORS");

app.use("/user", userRoutes);
app.use("/timeline", timelineRoutes);

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1-5mpwi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    app.listen(process.env.PORT || 3000);
})
.catch((err) => {
    console.log(err);
})