#!/usr/bin/env node
'use strict'

const fs = require('fs-extra')
const path = require('path')

const argv = require('minimist')(process.argv.slice(2))
require('./helpers/colors')

const help = require('./help')
const styles = require('./helpers/compile-css')
const PathAttrs = require('./helpers/path-attrs')
const compileFiles = require('./helpers/compile')
const { source, destination, styleFile } = require('./helpers/paths')

/* styles */
styles.require('purecss/build/pure.css')
styles.require('purecss/build/grids-responsive-min.css')

void (function main() {
  if (argv.help || argv.h || !argv._.length) {
    console.log(help.main)
    return
  }

  if (argv._.includes('build')) {
    compileFiles(source, destination)
    styles.build(styleFile)
  }
})()
