const dynamoClient = require('../aws/dynamo_db')
const bucket = require('../aws/s3_bucket')
const uuid = require('uuid')
const tableName = 'media-table'

const checkMediaDocObjectFields = (mediaDoc) => {
    const expectedFields = ['url', 'docname', 'username']
    const mediaFields = Object.keys(mediaDoc)
    const isValidUserObject = mediaFields.every((field) => expectedFields.includes(field))
    if (! isValidUserObject) {
        return false
    }
    return true
}

const addMediaDoc = async (mediaDoc) => {
    try {
        let checkMediaFields = checkMediaDocObjectFields(mediaDoc)
        if (! checkMediaFields) {
            return null
        }
        mediaDoc.id = uuid.v4()

        const params = {
            TableName: tableName,
            Item: mediaDoc
        }
        await dynamoClient.put(params).promise()
        return mediaDoc
    } catch (e) {
        console.log(e)
        return e
    }
}

const getMediaDoc = async (id, username) => {
    const params = {
        TableName: tableName,
        Key: {
            id,
            username
        }
    }
    let mediaDoc = await dynamoClient.get(params).promise()
    return mediaDoc.Item
}

const getMediaDocsByUsername = async (username) => {
    const params = {
        TableName: tableName,
        FilterExpression: `username = :username`,
        ExpressionAttributeValues: {
            ":username": username
        }
    }
    let usersDocs = await dynamoClient.scan(params).promise()
    return usersDocs.Items
}

const updateMediaDoc = async (mediaDoc) => {
    const params = {
        TableName: tableName,
        Item: mediaDoc
    }
    const updatedMediaDoc = await dynamoClient.put(params).promise()
    return updatedMediaDoc.Item
}

const deleteMediaDoc = async (id, username, url) => {
    const params = {
        TableName: tableName,
        Key: {
            id,
            username
        }
    }
    bucket.deleteFile(url)
    return await dynamoClient.delete(params).promise()
}

module.exports = {
    getMediaDoc,
    addMediaDoc,
    updateMediaDoc,
    deleteMediaDoc,
    getMediaDocsByUsername
}
