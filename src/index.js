const app = require('./app')
const config = require('../config')

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`listening on port ${
        config.hosting.port
    }`)
})