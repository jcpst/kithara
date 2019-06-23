'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const pug = require('pug')
const marked = require('jstransformer-marked').render
const { source } = require('./paths')

/**
 * @function fileLines
 * @param fileName {string}
 * @returns {string[]}
 */
function fileLines(fileName) {
  return fs.readFileSync(fileName, 'utf-8').split(os.EOL)
}

/**
 *
 */
function indent(spaces) {
  return line => line.padStart(line.length + spaces)
}

/**
 *
 */
function mdLayout(fullPath) {
  return [
    'extends /_layout.pug',
    'block content',
    '  :marked(gfm=true mangle=true)',
    ...fileLines(fullPath).map(indent(4))
  ].join(os.EOL)
}

/**
 * @function pugFileToHtml
 * @param file {PathAttrs}
 * @returns {string}
 */
function pugFileToHtml(file) {
  return pug.renderFile(file.fullPath, {
    filename: file.name,
    filters: {
      marked
    }
  })
}

/**
 * @function markdownFileToHtml
 * @param file {PathAttrs}
 * @returns {string}
 */
function markdownFileToHtml(file, locals = {}) {
  return pug.render(mdLayout(file.fullPath), {
    basedir: source,
    filename: file.name + '.md',
    filters: {
      marked
    },
    ...locals
  })
}

module.exports = {
  markdownFileToHtml,
  pugFileToHtml
}
