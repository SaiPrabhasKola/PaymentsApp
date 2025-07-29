const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try {
        console.log("handle reached authmiddleware")
        const authHeader = req.headers.authorization
        console.log(authHeader)
        if (!authHeader) {
            return res.status(403).json({ message: "no token provided" })
        }
        console.log('handle')
        let token = authHeader.split(' ')[1];
        console.log(`got the token ${token}`)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded._id)
        req.userId = decoded.userId
        console.log(req.userId)
        next()
    } catch (error) {
        return res.status(403).json({ error: error })
    }
}

module.exports = {
    authMiddleware
}