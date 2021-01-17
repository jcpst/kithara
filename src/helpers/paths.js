'use strict'

const path = require('path')

const dirname = process.cwd() //__dirname
const projectRoot = path.join(dirname)
const globalConfig = path.join(dirname, 'global-config.js')
const source = path.join(projectRoot, 'src')
const destination = path.join(projectRoot, 'build')
const styleFile = path.join(destination, 'style.css')

module.exports = {
  dirname,
  projectRoot,
  globalConfig,
  source,
  destination,
  styleFile
}
