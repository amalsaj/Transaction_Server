const jwt = require('jsonwebtoken')

const generateTokensAndSetCookies = (userId, res) => {
    const token = jwt.sign({userId},"amal",{
        expiresIn:"15d"
    })

    res.cookie("jwt",token),{
        maxAge: 15 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        secure:true,
    }
}
module.exports = generateTokensAndSetCookies