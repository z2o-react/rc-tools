#!/usr/bin/env node

/**
 * Copyright (c) 2019 z2o-react
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const program = require('commander')
const packageInfo = require('../package.json')

program
  .version(packageInfo.version)
  .description(packageInfo.description)
  .command('run [name]', 'run specified task')
  .parse(process.argv)
