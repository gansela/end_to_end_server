const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken");
const dbtest = require("../db/nwScripts")
const verify = require("../utils/verify")
const queryValidation = require("../validation/queryValidation")


router.use((req, res, next) => {
    const { authorization } = req.headers
    const isVerify = verify(authorization)
    if (!isVerify) return res.status(401).send({ errMassage: "verification failed" })
    next();
})

router.use(queryValidation)

router.get("/ordersheaders", async (req, res, next) => {
    const result = await dbtest.getOrdersHeaders(req.query)
    res.json(result)
})

router.get("/orders", async (req, res, next) => {
    const result = await dbtest.getOrdersData(req.query)
    res.json(result)
})

router.get("/costumers", async (req, res, next) => {
    const result = await dbtest.getCostumersData(req.query)
    res.json(result)
})




module.exports = router;