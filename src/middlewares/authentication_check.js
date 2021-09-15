const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config')

const {jwttoken} = config

const authenticationCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, jwttoken.secret)
        const user = await User.getUserByUsername(decoded.username)
        if (! user) {
            throw new Error()
        }
        if (user.token === token) {
            req.token = token
            req.user = user
            next()
        }
    } catch (e) {
        return res.status(401).send()
    }
}

module.exports = authenticationCheck
