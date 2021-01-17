'use strict'

const outdent = require('outdent')

const main = outdent`
  usage: kithara [command]
  
  commands:
    build          build the project
`

module.exports = {
  main,
}
