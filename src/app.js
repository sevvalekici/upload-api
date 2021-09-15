const express = require('express')
const userRouter = require('./routers/user')
const mediaRouter = require('./routers/media')
const handlerRouter = require('./routers/handler')

const app = express()
app.use(express.json())
// to support urlencoded data
app.use(express.urlencoded({extended: true}))
app.use(userRouter)
app.use(mediaRouter)
app.use(handlerRouter)

module.exports = app