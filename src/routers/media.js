const express = require('express')
const mime = require('mime-types')
const Media = require('../models/media')
const bucket = require('../aws/s3_bucket')
// authentication middleware
const authenticationCheck = require('../middlewares/authentication_check')
// authorization middlewares
const authorization = require('../middlewares/authorization_check')
const authorizationCheckNormal = authorization.authorizationCheckNormal

const router = new express.Router()

// post a new media document
router.post('/media', authenticationCheck, authorizationCheckNormal, bucket.upload.single('file'), async (req, res) => {
    try {
        let mediaDoc = {
            docname: req.file.originalname,
            url: req.file.location,
            username: req.user.username
        }
        const media = await Media.addMediaDoc(mediaDoc)
        return res.status(201).send(media)
    } catch (e) {
        return res.status(400).send(e)
    }
})

// get all media that the user uploaded
router.get('/media/myprofile', authenticationCheck, authorizationCheckNormal, async (req, res) => {
    try {
        const mediaDocs = await Media.getMediaDocsByUsername(req.user.username)
        let returnStr = ''
        await Promise.all(mediaDocs.map(async (doc) => {
            // get a publicly visible url from private bucket
            doc.signedUrl = await bucket.downloadWithSignedUrl(doc.url, doc.docname)
            // get the mime type of the doc
            let mimeType = mime.contentType(doc.docname)
            // if it is image, add with html image element
            if (mimeType.includes('image')) {
                returnStr = returnStr + `<img src="${
                    doc.signedUrl
                }" style="width:256px;"></img><br>`
            } else if (mimeType.includes('video')) { // if it is video, add with html video element
                returnStr = returnStr + `<video style="width:256px;" controls>
                <source src="${
                    doc.signedUrl
                }">
                Your browser does not support the video tag.
              </video><br>`
            }
        }))
        // set the header informing response will be in html form
        res.setHeader('Content-Type', 'text/html')
        return res.status(200).send(returnStr)
    } catch (e) {
        console.log(e)
        return res.status(400).send()
    }
})

router.patch('/media', authenticationCheck, authorizationCheckNormal, async (req, res) => {
    try {
        if (req.user.body !== req.body.username) {
            return res.status(400).send(e)
        }
        let updatedMedia = await Media.updateMediaDoc(req.body)
        return res.status(200).send(updatedMedia)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})

router.delete('/media/delete/:id', authenticationCheck, authorizationCheckNormal, async (req, res) => {
    const id = req.params.id
    try {
        let toDeleteMediaDoc = await Media.getMediaDoc(id, req.user.username)
        if (Object.keys(toDeleteMediaDoc).length === 0) {
            return res.status(404).send()
        }
        await Media.deleteMediaDoc(id, req.user.username, toDeleteMediaDoc.url)
        return res.status(200).send('Deleted' + toDeleteMediaDoc.docname)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})

module.exports = router
