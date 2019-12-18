const express = require("express")
const router = express.Router();
// const logger = require("../utils/logger")
const moment = require("moment")
const userValidation = require("../validation/userValidation")
const jwt = require("jsonwebtoken");
const poolFunc = require("../db/poolScripts")
const bcrypt = require('bcryptjs');
const hashSalt = bcrypt.genSaltSync(parseInt(process.env.HASH_NUM));
const { isInsertExist, isUserExist, isChangePassword, isCheckPasswords } = poolFunc



router.use(userValidation)

router.use("/signin", async (req, res, next) => {
    const user = await isUserExist(req.body)
    console.log(user)
    if (user) res.json({ message: "email already exist" })
    next()
})

router.post("/signin", async (req, res, next) => {
    const { email, password } = req.body
    const newPassword = bcrypt.hashSync(password, hashSalt)
    const id = await isInsertExist({ ...req.body, password: newPassword })
    if (!id) res.json({ message: "sign in failed" })
    res.send({ message: `sign in completed`, redirect: true })
})


router.use("/", async (req, res, next) => {
    const { email, password } = req.body
    const user = await isUserExist(req.body)
    if (!user) res.json({ message: "wrong email or password" })
    const isPasswordGood = (bcrypt.compareSync(password, user.password))
    console.log(isPasswordGood)
    if (!isPasswordGood) res.json({ message: "wrong email or password" })
    req.body.id = user.id
    next()
})

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body
    const token = await getJwt({ ...req.body, password: null })
    res.send({ message: `login completed`, redirect: true, key: token, details: email })
})

router.use("/changepassword", async (req, res, next) => {
    const { email, password, newPassword } = req.body
    const passArray = await isCheckPasswords(req.body)
    if (!passArray) res.json({ message: "new password needs to be different from last 5 passwords" })
    const hashNewPassword = bcrypt.hashSync(newPassword, hashSalt)
    passArray.unshift(hashNewPassword)
    passArray.length = 5
    req.body.passArray = passArray
    next()
})

router.post("/changepassword", async (req, res, next) => {
    const {  passArray } = req.body
    const isChange = await isChangePassword({ ...req.body, newPassword: passArray[0] })
    if (!isChange) res.send({ message: `password change failed.`, redirect: false })
    res.send({ message: `password changed, please log in`, redirect: true })
})



function getJwt(payload) {
    const result = new Promise((resolve, reject) => {
        resolve(jwt.sign({ payload }, process.env.SECRET_KEY, { expiresIn: '72h' }))
    });
    return result
}

module.exports = router;