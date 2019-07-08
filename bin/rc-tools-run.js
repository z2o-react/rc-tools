#!/usr/bin/env node

/**
 * Copyright (c) 2019 z2o-react
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const program = require('commander')
const chalk = require('chalk')

program.parse(process.argv)

let taskName = program.args[0]

function runTask(toRun) {
  const gulp = require('gulp')
  const taskInstance = gulp.task(toRun)

  if (taskInstance === undefined) {
    return
  }
  const start = process.uptime()

  try {
    taskInstance.apply(gulp)
    const duration = process.uptime() - start
    console.log(`> ${chalk.yellow('run task ' + toRun)} ${chalk.cyan(duration.toFixed(5) + 's')}`)
  } catch (err) {
    const duration = process.uptime() - start
    console.log(`> ${chalk.yellow('run task ' + toRun)} ${chalk.cyan(duration.toFixed(5) + 's')}`)
    console.log(err)
  }
}

if (!taskName) {
  program.help()
} else {
  console.log('> rc-tools run', taskName)
  require('../lib/gulpfile')

  runTask(taskName)
}
