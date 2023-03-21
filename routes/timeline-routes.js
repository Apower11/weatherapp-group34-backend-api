const express = require("express");
const { check } = require("express-validator");

const timelineController = require("../controllers/timeline-controller");
const router = express.Router();

router.get("/getTimeline/:userId/:timelineDate", [], timelineController.getTimeline);

router.get("/getTimestamp/:timestampId", [], timelineController.getTimestamp);

router.post("/createTimeline", [], timelineController.createTimeline);

router.post("/createTimestamp", [], timelineController.createTimestamp);

module.exports = router;