const dbValidaciones = require('./dbValidaciones')
const genearaJWT = require('./GenearaJWT')

module.exports = {
    ...dbValidaciones,
    ...genearaJWT,
}
