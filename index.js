const express = require('express')
const app = express()
const config = require('./config')
const userRouter = require('./src/routers/user')
const mediaRouter = require('./src/routers/media')
const handlerRouter = require('./src/routers/handler')

app.use(express.json())
// to support urlencoded data
app.use(express.urlencoded({extended: true}))
app.use(userRouter)
app.use(mediaRouter)
app.use(handlerRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on port ${
        config.hosting.port
    }`)
})
