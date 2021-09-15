const request = require('supertest')
const app = require('../src/app')
const Media = require('../src/models/media')
const testdata = require('./testdb/test_data')

// upload media to test
test('Post a media', async () => {
    const response = await request(app).post('/media').send()
        .attach('file', 'tests/testdb/coraline_image.jpg')
        .set('Authorization', `Bearer ${testdata.userTwo.token}`)
        .expect(201)
    expect(response).not.toBeNull()
})

// Get user media test
test('Should get users all media', async () => {
    await request(app)
        .get('/media/myprofile')
        .set('Authorization', `Bearer ${testdata.userTwo.token}`)
        .send()
        .expect(200)
})