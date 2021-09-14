const aws = require('aws-sdk')
const config = require('../../config')

aws.config.update({
    secretAccessKey: config.awsConfig.awsSecretAccessKey, 
    accessKeyId: config.awsConfig.awsAccessKeyId, 
    region: config.awsConfig.awsRegion
})

module.exports = aws
