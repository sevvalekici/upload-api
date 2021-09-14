require('dotenv').config({
    path: __dirname + '/.env'
})
const config = {
    jwttoken: {
        secret: process.env.JWT_SECRET
    },
    hosting: {
        port: process.env.PORT,
        host: process.env.HOST
    },
    awsConfig: {
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS,
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsRegion: process.env.AWS_REGION,
        awsBucketName: process.env.AWS_BUCKET_NAME
    },
    mailForErrors: process.env.ERROR_MAIL
}

module.exports = config
