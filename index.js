const express = require("express")
const bodyParser = require('body-parser')
require("dotenv").config()
const cors = require('cors')
const authRouter = require("./routes/auth")
const northwindRouter = require("./routes/northwind")

const api = express()

api.listen(process.env.PORT, () => {
    console.log("server running")
})

api.use(cors())

api.use(bodyParser.json())

api.use("/", (req, res, next) => {
    console.log("connection")
    // console.log(req.body)
next()
})

api.use("/auth", authRouter)

api.use("/northwind", northwindRouter)