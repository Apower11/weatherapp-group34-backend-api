const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const Timeline = require("../models/Timeline");
const Timestamp = require("../models/Timestamp");
const User = require("../models/User");
const HttpError = require("../models/http-error");

const getTimeline = async (req, res, next) => {
    const timelineDate = req.params.timelineDate;

    let timeline;
    try {
        timeline = await Timeline.findOne({date: timelineDate});
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Fetching posts failed, please try again.',
            500
        );
        return next(error);
    }
    res.json({timeline: timeline});
}

const getTimestamp = async (req, res, next) => {
    const timestampId = req.params.timestampId;

    let timestamp;
    try {
        timestamp = await Timestamp.findOne({_id: timestampId});
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Fetching posts failed, please try again.',
            500
        );
        return next(error);
    }
    res.json({timestamp: timestamp});
}

const createTimeline = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next (
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { date, userLoggedIn } = req.body;

    const createdTimeline = new Timeline({
        date,
        timestamps: []
    });

    let user;
    try {
        user = await User.findById(userLoggedIn);
    } catch (err) {
        console.log(err);
        const error = new HttpError('Creating a post failed, please try again', 500);
        return next(error);
    }

    if(!user) {
        const error = new HttpError('Could not find user for the provided id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        console.log("Timeline: " + createdTimeline);
        await createdTimeline.save({ session: sess });
        if(user.timelines == undefined){
            user.timelines = [];
        }
        console.log("Userrrr: " + user);
        user.timelines.push(createdTimeline);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Creating timeline failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ timeline: createdTimeline});
}

const createTimestamp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next (
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { timelineId, time, name, location, latitude, longitude, temperature, weatherCode, conditions } = req.body;

    const createdTimestamp = new Timestamp({
        time,
        name,
        location,
        latitude,
        longitude,
        temperature,
        weatherCode,
        conditions
    });

    let timeline;
    console.log(timelineId);
    try {
        console.log("Id: " + timelineId);
        timeline = await Timeline.findById(timelineId);
        console.log("Timeline: " + timeline);
    } catch (err) {
        console.log("Errr: " + err);
        const error = new HttpError('Creating a post failed, please try again', 500);
        return next(error);
    }

    if(!timeline) {
        const error = new HttpError('Could not find user for the provided id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTimestamp.save({ session: sess });
        timeline.timestamps.push(createdTimestamp);
        await timeline.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating timeline failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ timestamp: createdTimestamp });
}




exports.getTimeline = getTimeline;
exports.getTimestamp = getTimestamp;
exports.createTimeline = createTimeline;
exports.createTimestamp = createTimestamp;