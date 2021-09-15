const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const config = require('../config')
const testdata = require('./testdb/test_data')

// create user test
test('Should create a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Sevval Ekici',
        email: 'sevval@example.com',
        password: testdata.userOne.password,
        userType: 'normal',
        username: 'trying',
        secret: config.createUserKey.secretKey
    }).expect(201)
    const testUser = await User.getUserByUsername(response.body.user.username)
    expect(testUser).not.toBeNull()
    expect(testUser.password).not.toBe('somePassword123')
})

// login test
test('Should login to an existing user account', async () => {
    const response = await request(app).post('/users/login').send({
        username: testdata.userOne.username,
        password: testdata.userOne.password
    }).expect(200)
    const testUser = await User.getUserByUsername(testdata.userOne.username)
    expect(testUser.token).toBe(response.body.token)
})

// Get user profile test
test('Should get users profile', async () => {
    await request(app)
        .get('/users/my/profile')
        .set('Authorization', `Bearer ${testdata.userTwo.token}`)
        .send()
        .expect(200)
})

// admin users delete test
test('Should get users profile', async () => {
    await request(app)
        .delete('/users/'+ testdata.userThree.username)
        .set('Authorization', `Bearer ${testdata.userTwo.token}`)
        .send()
        .expect(200)
})