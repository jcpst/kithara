#!/usr/bin/env node
'use strict'

const fs = require('fs-extra')
const path = require('path')

const argv = require('minimist')(process.argv.slice(2))
require('./helpers/colors')

const help = require('./help')
const styles = require('./helpers/compile-css')
const PathAttrs = require('./helpers/path-attrs')
const { markdownFileToHtml, pugFileToHtml } = require('./helpers/compile')
const {
  dirname,
  projectRoot,
  globalConfig,
  source,
  destination,
  styleFile
} = require('./helpers/paths')

/* styles */
styles.require('purecss/build/pure.css')
styles.require('purecss/build/grids-responsive-min.css')

/**
 * For dealing with files that will be transformed into HTML.
 *
 * @function convertToHtml
 * @param file {PathAttrs} - Object that contains file metadata.
 * @param dest {string} - Path to the destination directory.
 */
function convertToHtml(file, dest) {
  const outFile = path.join(dest, file.name + '.html')
  const outDir = path.parse(outFile).dir

  fs.ensureDirSync(outDir)

  if (file.isPug) {
    fs.writeFileSync(outFile, pugFileToHtml(file))
  } else if (file.isMd && !file.pugFileExists) {
    fs.writeFileSync(outFile, markdownFileToHtml(file))
  } else {
    // do nothing
  }
}

/**
 * This function is reponsible for calling compilers and writing the results to
 * disc. It skips hidden files, which start with an underscore (_). If the file
 * is not a file we care about compiling, will copy it with no transformation.
 *
 * @function convertToStaticResource
 * @param file {PathAttrs} - Object that contains file metadata.
 * @param dest {string} - Path to the destination directory.
 */
function convertToStaticResource(file, dest) {
  if (file.isHidden) {
    return
  }

  if (file.toHtml) {
    convertToHtml(file, dest)
  } else if (file.isCss) {
    styles.add(file.fullPath)
  } else {
    fs.copySync(file.fullPath, path.join(dest, file.base))
  }

  console.log('read'.cyan, file.fullPath)
}

/**
 * Recursively iterates through the contents of the source directory, calling
 * the function responsible for compiling/writing/coping files to the
 * destination directory.
 *
 * @function compileFiles
 * @param src {string} - Path to the source directory.
 * @param dest {string} - Path to the destination directory.
 */
function compileFiles(src, dest) {
  const srcDirFiles = fs.readdirSync(src)
  let i = srcDirFiles.length

  while (i--) {
    const fullPath = path.join(src, srcDirFiles[i])
    const file = Object.create(PathAttrs).init(fullPath)

    if (file.isDir) {
      compileFiles(fullPath, path.join(dest, file.name))
    } else {
      convertToStaticResource(file, dest)
    }
  }

  console.log('>>> html files compiled'.green)
}

// ============================================================================
// Entry point
// ============================================================================
if (argv.help || argv.h || !argv._.length) {
  console.log(help.main)
}

if (argv._.includes('build')) {
  compileFiles(source, destination)
  styles.build(styleFile)
}
