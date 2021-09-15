const dynamoClient = require('../aws/dynamo_db')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const config = require('../../config')
const tableName = 'users-table'
const checkUserObjectFields = (user) => {
    const expectedFields = [
        'name',
        'username',
        'email',
        'password',
        'userType'
    ]
    const userFields = Object.keys(user)
    const isValidUserObject = userFields.every((field) => expectedFields.includes(field))
    if (! isValidUserObject) {
        return false
    }
    return true
}

const addUser = async (user) => {
    try {
        let checkUserFields = checkUserObjectFields(user)
        if (! checkUserFields) {
            return null
        }
        user.password = await bcrypt.hash(user.password, 8) // runs the algorithm 8 times
        user.id = uuid.v4()

        const params = {
            TableName: tableName,
            Item: user
        }
        await dynamoClient.put(params).promise()
        return user
    } catch (e) {
        console.log(e)
        return e
    }
}

const getUsers = async () => {
    const params = {
        TableName: tableName
    }
    const users = await dynamoClient.scan(params).promise()
    return users.Items
}

const getUserByUsername = async (username) => {
    const params = {
        TableName: tableName,
        Key: {
            username
        }
    }
    const user = await dynamoClient.get(params).promise()
    return user.Item
}

const updateUser = async (user) => {
    const params = {
        TableName: tableName,
        Item: user
    }
    const updatedUser = await dynamoClient.put(params).promise()
    return updatedUser.Item
}

const logoutUser = async (user) => {
    delete user.token
    const params = {
        TableName: tableName,
        Item: user
    }
    return await dynamoClient.put(params).promise()
}

const deleteUser = async (username) => {
    const params = {
        TableName: tableName,
        Key: {
            username
        }
    }
    let deleteUser = await dynamoClient.delete(params).promise()
    return deleteUser.Item
}

const verifyPassword = (password, user) => {
    return bcrypt.compare(password, user.password)
}

const tokenAuth = async (user) => {
    const token = jwt.sign({
        username: user.username
    }, config.jwttoken.secret, {expiresIn: '2d'})
    user.token = token
    await updateUser(user)
    return token
}

const findUser = async (username, password) => {
    const user = await getUserByUsername(username)
    if (! user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (! isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

module.exports = {
    getUsers,
    getUserByUsername,
    addUser,
    updateUser,
    deleteUser,
    tokenAuth,
    verifyPassword,
    findUser,
    logoutUser
}
