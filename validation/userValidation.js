// const express = require("express")
const Joi = require("@hapi/joi");

//  email regex
const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const userSchema = Joi.object({
    email: Joi.string().regex(pattern).required(),
    password: Joi.string().required(),
})

const changePassSchema = Joi.object({
    email: Joi.string().regex(pattern).required(),
    password: Joi.string().required(),
    newPassword: Joi.string().required()
})


//  switches between change pssword and regular auth schema
function userValidation(req, res, next) {
    const { error } = req.body.newPassword? changePassSchema.validate(req.body) :userSchema.validate(req.body);
    if (error) return res.json({ message: "bad email or passwaord" })
    next();
}

module.exports = userValidation;