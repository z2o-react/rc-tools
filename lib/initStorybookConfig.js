const fs = require('fs-extra')
const path = require('path')

module.exports = (dir, { name, homepage }) => {
  const configJs = `
import { configure, addParameters } from '@storybook/react'

function loadStories() {
  require('${dir}storybook/index.js')
}

addParameters({
  options: {
    theme: {
      name: '${name}',
      brandUrl: '${homepage}',
      brandTitle: '${name}',
    },
  },
});

configure(loadStories, module)`

  const manageHeaderHtml = `
<link
  rel="icon"
  type="image/png"
  href="https://avatars0.githubusercontent.com/u/51219043?s=400&u=82a61e1385d417e03631c1aa4df748635c970a9a&v=4"
/>`
  fs.writeFileSync(path.join(__dirname, './storybook/config.js'), configJs)
  fs.writeFileSync(path.join(__dirname, './storybook/manager-head.html'), manageHeaderHtml)
}
