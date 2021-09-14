const authorizationCheckNormal = async (req, res, next) => {
    try {
        const whiteList = ['normal', 'admin']
        whiteList.forEach(type => {
            if (req.user.userType === type) {
                next()
            }
        })
    } catch (e) {
        return res.status(403).send()
    }
}
const authorizationCheckAdmin = async (req, res, next) => {
    try {
        const whiteList = ['admin']
        whiteList.forEach(type => {
            if (req.user.userType === type) {
                next()
            }
        })
    } catch (e) {
        return res.status(403).send()
    }
}

module.exports = {
    authorizationCheckNormal,
    authorizationCheckAdmin
}
