/**
 * 
 */

// const { join: pathJoin } = require('path')

// const { parsed, error } = require('dotenv').config({ 
//   path: pathJoin(__dirname, '..', '.env')
// })

const { server } = require('./middleware')()

module.exports = { server }