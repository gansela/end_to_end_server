const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken");
const dbtest = require("../db/nwScripts")


    router.use((req, res, next) => {
        const { authorization } = req.headers
        jwt.verify(authorization, process.env.SECRET_KEY, (err, decoded) => {
            if (err) return res.status(401).send({ errMassage: "verification failed"})
            console.log(decoded)    
            next();
        })
    })
    router.get("/orders", async (req, res, next) => {
        const result =  await dbtest.getOrdersData(req.query)
        res.json(result)
    })




module.exports = router;