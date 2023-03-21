const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const HttpError = require("../models/http-error");

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError(
            'User exists already, please login instead',
            422
        )
    }

    let hashedPassword;
    try {
        console.log("Password: " + password);
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log("Errorrrrr: " + err);
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }

    const createdUser = new User({
        email,
        password: hashedPassword,
        timelines: []
    });

    try {
        await createdUser.save();
    } catch(err) {
        console.log("Errror 2: " + err);
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    let token;

    try {
    token = jwt.sign({userId: createdUser.id, email: createdUser.email }, 
        'supersecret_dont_share', 
        {expiresIn: '1h'}
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser, token: token });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch(err) {
        const error = new HttpError(
            'Logging in failed, please try again.',
            500
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500)
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in',
            403
        );
        return next(error);
    }

    if(!existingUser) {
        const error = new HttpError(
            'Invalid credentials, unable to log you in.',
            403
        );
        return next(error);
    }

    let token;

    try {
    token = jwt.sign({userId: existingUser.id, email: existingUser.email }, 
        'supersecret_dont_share', 
        {expiresIn: '1h'}
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again.',
            500
        );
        return next(error);
    }

    res.json({
    user: existingUser,
    token: token
});
};

exports.register = register;
exports.login = login;