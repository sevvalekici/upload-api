const express = require('express')
const app = express()
const config = require('../config')
const userRouter = require('./routers/user')
const mediaRouter = require('./routers/media')
const handlerRouter = require('./routers/handler')

app.use(express.json())
// to support urlencoded data
app.use(express.urlencoded({extended: true}))
app.use(userRouter)
app.use(mediaRouter)
app.use(handlerRouter)

const port = process.env.PORT || 3000
const hostname = process.env.HOST || '127.0.0.1'
app.listen(port, hostname, () => {
    console.log(`listening on port ${
        config.hosting.port
    }`)
})
