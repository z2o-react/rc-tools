const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')

function genStorybook(dir) {
  const config = require(path.join(dir, './package.json'))
  const firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')
  // get all files
  const files = glob.sync(path.join(dir, './examples/*.js'), {})

  const importArr = []
  const addArr = []
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
      .map((item, index) => {
        if (/^\d+$/.test(item) && index === 0) {
          return ''
        }
        return firstUpperCase(item)
      })
      .join('')

    importArr.push(`import ${ComponentName} from '../examples/${fileName}'`)

    addArr.push(`.add('${fileName.replace(/^\d*-/, '')}', () => <${ComponentName} />)`)
  })

  const fileContent = `
import React from 'react'
import Markdown from 'react-markdown'
import { storiesOf } from '@storybook/react'
import { withConsole } from '@storybook/addon-console'

${importArr.join('\n')}
import READMECode from '../README.md'

storiesOf('${config.name}', module)
.addDecorator((storyFn, context) => withConsole()(storyFn)(context))
.add(
  'readme',
  () => (
    <div
      className="markdown-body entry-content"
      style={{
        padding: 24,
      }}
    >
      <Markdown escapeHtml={false} source={READMECode} />
    </div>
  ),
  {
    source: {
      code: READMECode,
    },
  },
)
${addArr.join('\n')}
`

  if (!fs.existsSync(path.join(dir, './storybook/'))) {
    fs.mkdir(path.join(dir, './storybook/'))
  }
  fs.writeFileSync(path.join(dir, './storybook/index.js'), fileContent)
}

module.exports = genStorybook
