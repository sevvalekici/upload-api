const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const config = require('../config')
let testUsername = 'trying'
let testPassword = 'somePassword123'
let testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRyeWluZyIsImlhdCI6MTYzMTY0NjQzMCwiZXhwIjoxNjMxODE5MjMwfQ.e8F8Ed4lkleaEMUqIQ9fdkjSJcEEaSeuQj650fJYXUA'

test('Should create a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Sevval Ekici',
        email: 'sevval@example.com',
        password: testPassword,
        userType: 'normal',
        username: 'trying',
        secret: config.createUserKey.secretKey
    }).expect(201)
    const testUser = await User.getUserByUsername(response.body.user.username)
    expect(testUser).not.toBeNull()
    expect(testUser.password).not.toBe('somePassword123')
})

test('Should login to an existing user account', async () => {
    const response = await request(app).post('/users/login').send({
        username: testUsername,
        password: testPassword
    }).expect(200)
    const testUser = await User.getUserByUsername(testUsername)
    expect(testUser.token).toBe(response.body.token)
})

test('Should get users profile', async () => {
    await request(app)
        .get('/users/my/profile')
        .set('Authorization', `Bearer ${testToken}`)
        .send()
        .expect(200)
})