const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
    return res.status(200).send('Welcome to Media-Upload-API')
})

router.get('/*', (req, res) => {
    return res.status(404).send('Route not found')
})

module.exports = router
