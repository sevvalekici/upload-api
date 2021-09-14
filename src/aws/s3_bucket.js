const aws = require('./aws')
const multer = require('multer')
const multerS3 = require('multer-s3')
const config = require('../../config')
const s3 = new aws.S3()

const limits = {
    files: 1,
    fileSize: { // 30 mb
        fieldSize: 30 * 1024 * 1024
    }
}

// ONLY images and video
const fileFilterForImageAndVideo = (req, file, cb) => {
    if (file.mimetype === 'image/apng' || file.mimetype === 'image/avif' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg+xml' || file.mimetype === 'image/webp' || file.mimetype === 'video/x-flv' || file.mimetype === 'video/mp4' || file.mimetype === 'video/quicktime' || file.mimetype === 'video/x-msvideo' || file.mimetype === 'video/x-ms-wmv') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    fileFilterForImageAndVideo,
    limits: limits,
    storage: multerS3(
        {
            s3: s3,
            bucket: config.awsConfig.awsBucketName,
            acl: 'private',
            // serverSideEncryption: 'AES256'
            metadata: function (req, file, cb) {
                cb(null, {fieldName: file.fieldname})
            },
            key: function (req, file, cb) {
                cb(null, `${
                    req.user.username
                }/` + Date.now().toString())
            }
        }
    ),
    onError: function (err, next) {
        console.log('error', err)
        next(err)
    }
})

const download = function (url) {
    try {
        const urlOfFile = new URL(url)
        // getting file from the bucket
        const bucket = urlOfFile.host.split('.')[0]
        const key = urlOfFile.pathname.substr(1)
        const params = {
            Bucket: bucket,
            Key: key
        }
        var fileStream = s3.getObject(params).createReadStream()
        return fileStream
    } catch (e) {
        console.log(e)
    }
}

const downloadWithSignedUrl = function (url, originalDocName) {
    const urlOfFile = new URL(url)
    // getting file from the bucket
    const bucket = urlOfFile.host.split('.')[0]
    const key = urlOfFile.pathname.substr(1)
    // two hours, i determined this according to maximum exam duration,
    // if it wouldnt get lost once its open from frontend, this expire time can be changed
    const signedUrlExpireTime = 2 * 60 * 60 * 1000
    const params = {
        Bucket: bucket,
        Key: key,
        Expires: signedUrlExpireTime,
        ResponseContentDisposition: `attachment; filename ="${originalDocName}"`
    }
    const signedUrl = s3.getSignedUrl('getObject', params)
    return signedUrl
}

const deleteFile = function (url) {
    try {
        const urlOfFile = new URL(url)
        // deleting file from the bucket
        const bucket = urlOfFile.host.split('.')[0]
        const key = urlOfFile.pathname.substr(1)
        const params = {
            Bucket: bucket,
            Key: key
        }
        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log(err, err.stack)
            } else {
                console.log('Deleted:' + key)
            }
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    upload,
    download,
    deleteFile,
    downloadWithSignedUrl
}
