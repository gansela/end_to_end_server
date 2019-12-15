const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken");
const nwPool = require("../db/nwPool")

    router.use((req, res, next) => {
        const { authorization } = req.headers
        jwt.verify(authorization, process.env.SECRET_KEY, (err, decoded) => {
            if (err) return res.status(401).send({ errMassage: "verification failed"})
            console.log(decoded)    
            next();
        })
    })
    router.get("/orders", async (req, res, next) => {
        const [query, params] = getOrdersQuery(req.query)
        const result = await nwPool.execute(query, params);
        const [first] = result;
        console.log(first)
        res.json(first)
    })


function getOrdersQuery(params) {
    return [`select * from orders `, [...Object.values(params)]]
}


module.exports = router;