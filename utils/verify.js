const jwt = require("jsonwebtoken");

async function verifyJwt(token) {
    const result = await jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return false
        console.log(decoded)
        return true
    })
    return result
}

module.exports = verifyJwt