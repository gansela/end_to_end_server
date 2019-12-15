const express = require("express")
const router = express.Router();
// const logger = require("../utils/logger")
const moment = require("moment")
const userValidation = require("../validation/userValidation")
const jwt = require("jsonwebtoken");
const usersPool = require("../db/usersPool")


router.use(userValidation)


router.use("/login", (req, res, next) => {
    const { email, password } = req.body
console.log("hey")
    next()
})

router.use("/login",  async (req, res, next) => {
    const [query, params] = getUsersQuery(req.body)
    const result =   await usersPool.execute(query, params);
    const [first] = result;
    if (!first.length) res.json({message: "wrong email or password"})
    next()
})

router.post("/login", (req, res, next) => {
    const { email, password } = req.body
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '72h' });
    console.log(token)
    res.send({message: `login completed`, redirect: true, key: token, details: email })
})



function getUsersQuery(params) {
    return [`select * from users_table where email = ? and password = ? `, [...Object.values(params)]]
}
module.exports = router;