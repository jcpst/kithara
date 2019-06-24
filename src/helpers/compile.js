'use strict'

const path = require('path')
const os = require('os')
const fs = require('fs-extra')
const pug = require('pug')
const marked = require('jstransformer-marked').render

require('./colors')

const PathAttrs = require('./path-attrs')
const {
  dirname,
  projectRoot,
  globalConfig,
  source,
  destination,
  styleFile
} = require('./paths')

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

module.exports = compileFiles
