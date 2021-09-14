const express = require('express')
const User = require('../models/user')
// authentication middleware
const authenticationCheck = require('../middlewares/authentication_check')
// authorization middlewares
const authorization = require('../middlewares/authorization_check')
const authorizationCheckAdmin = authorization.authorizationCheckAdmin
const authorizationCheckNormal = authorization.authorizationCheckNormal

const router = new express.Router()

router.post('/users', async (req, res) => {
    try {
        const user = await User.addUser(req.body)
        const token = await User.tokenAuth(user)
        return res.status(201).send({user, token})
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findUser(req.body.username, req.body.password)
        await User.tokenAuth(user)
        return res.status(200).send(user)
    } catch (e) {
        return res.status(400).send()
    }
})

router.get('/users', authenticationCheck, authorizationCheckAdmin, async (req, res) => {
    try {
        const users = await User.getUsers()
        return res.status(200).send(users)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.get('/users/:username', authenticationCheck, authorizationCheckNormal, async (req, res) => {
    const username = req.params.username
    try {
        const user = await User.getUserByUsername(username)
        return res.status(200).send(user)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.delete('/users/:username', authenticationCheck, authorizationCheckAdmin, async (req, res) => {
    const username = req.params.username
    try {
        await User.deleteUser(username)
        return res.status(200).send()
    } catch (e) {
        return res.status(500).send(e)
    }
})
router.post('/users/logout', authenticationCheck, authorizationCheckNormal, async (req, res) => {
    try {
        console.log('me here', req.user)
        console.log(req.user)
        const loggedOutUser = await User.logoutUser(req.user)
        console.log(loggedOutUser)
        return res.status(200).send('Successfully logged out')
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})

router.get('/users/myprofile', authenticationCheck, authorizationCheckNormal, async (req, res) => {
    try {
        const username = req.user.username
        const userToFind = await User.findOne({username})
        if (! userToFind) {
            return res.status(404).send()
        }
        // photoları generate et
        return res.send(userToFind)
    } catch (e) {
        return res.status(500).send()
    }
})

module.exports = router
