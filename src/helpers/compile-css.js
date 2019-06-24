'use strict'

const fs = require('fs')
const purify = require('purify-css')

// Hack to require css. From here: https://stackoverflow.com/a/12753026/3957261
require.extensions['.css'] = (m, f) => {
  m.exports = fs.readFileSync(f, 'utf8')
}

const pure = require('purecss/build/pure.css')
const pureGrid = require('purecss/build/grids-responsive-min.css')

const Css = {
  init() {
    this.cssString = ''
    return this
  },
  require(str) {
    const x = require(str)

    this.cssString += x
    return this
  },
  add(file) {
    const x = fs.readFileSync(file, 'utf8')

    this.cssString += x
    return this
  },
  build(styleFile) {
    purify(['./build/**/*.html'], this.cssString, {
      minify: true,
      output: styleFile
    })

    console.log('>>> css files compiled'.green)
  }
}

module.exports = Object.create(Css).init()
