'use strict'

const util = require('util')
const colors = util.inspect.colors

/**
 * Extends String.prototype with the following props for styling stdout:
 * - white
 * - grey
 * - black
 * - blue
 * - cyan
 * - green
 * - magenta
 * - red
 * - yellow
 * - bold
 * - italic
 * - underline
 * - inverse
 */
Object.keys(colors).forEach(color => {
  String.prototype.__defineGetter__(color, function() {
    const [open, close] = colors[color]
    return `\x1b[${open}m${this}\x1b[${close}m`
  })
})
