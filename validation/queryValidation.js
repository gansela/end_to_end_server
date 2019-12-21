const Joi = require("@hapi/joi");
const express = require("express")

const querySchema = Joi.object({
    firstname: Joi.string().max(20).allow(''),
    lastname: Joi.string().max(20).allow(''),
    shipcity: Joi.string().max(30),
    paymenttype: Joi.string().max(30)
})

function queryValidation(req, res, next) {
    const { error } = querySchema.validate(req.query)
    if (error) return res.json({ errMessage: "error!, bad paremeters" })
    next();
}

module.exports = queryValidation;