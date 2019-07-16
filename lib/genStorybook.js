const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')

function genStorybook(dir) {
  const config = require(path.join(dir, './package.json'))
  const firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')
  // get all files
  const files = glob.sync(path.join(dir, './examples/*.js'), {})

  const importString = []
  const addString = []
  const jsList = files.map((fileName) => {
    return fileName
      .split('/')
      .pop()
      .replace('.js', '')
  })

  // single-animation => SingleAnimation
  jsList.forEach((fileName) => {
    const ComponentName = fileName
      .split('-')
      .map((item) => firstUpperCase(item))
      .join('')

    importString.push(`import ${ComponentName} from '../examples/${fileName}';`)

    addString.push(`.add('${fileName}', () => <${ComponentName} />)`)
  })

  const fileContent = `
import React from 'react';

import { storiesOf } from '@storybook/react';
//import { action } from '@storybook/addon-actions';
${importString.join('\n')}

storiesOf('${config.name}', module)
${addString.join('\n')}
`

  if (!fs.existsSync(path.join(dir, './storybook/'))) {
    fs.mkdir(path.join(dir, './storybook/'))
  }
  fs.writeFileSync(path.join(dir, './storybook/index.js'), fileContent)
}

module.exports = genStorybook