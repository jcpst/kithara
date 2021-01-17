'use strict'

const fs = require('fs-extra')
const path = require('path')

/**
 * @name PathAttrs
 * @type {{
 *   fullPath: string
 *   root: string,
 *   dir: string,
 *   base: string,
 *   ext: string,
 *   name: string,
 *   isDir: boolean,
 *   isHidden: boolean,
 *   isPug: boolean,
 *   isMd: boolean,
 *   isCss: boolean,
 *   pugFileExists: boolean,
 *   toHtml: boolean
 *   vars: object
 * }}
 */
const PathAttrs = {
  /**
   *
   * @param {string} fullPath
   * @param {object} vars
   * @returns {PathAttrs}
   */
  init(fullPath, vars = {}) {
    Object.assign(this, path.parse(fullPath))
    this.fullPath = fullPath
    this.isDir = fs.lstatSync(this.fullPath).isDirectory()
    this.isHidden = this.name[0] === '_'
    this.isPug = this.ext.match(/\.(jade|pug)/) !== null
    this.isMd = this.ext.match(/\.(md|markdown)/) !== null
    this.isCss = this.ext.match(/\.(css)/) !== null
    this.pugFileExists = fs.existsSync(path.join(this.dir, this.name + '.pug'))
    this.toHtml = this.ext.match(/\.(jade|pug|md|markdown|html)/) !== null
    this.vars = vars
    return this
  },
}

module.exports = PathAttrs
