const aws = require('./aws')
const dynamoClient = new aws.DynamoDB.DocumentClient()

module.exports = dynamoClient
