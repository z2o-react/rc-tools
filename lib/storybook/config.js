
import { configure, addParameters } from '@storybook/react'

function loadStories() {
  require('/Users/lishuaishuai/Workspace/zero-component/button/storybook/index.js')
}

addParameters({
  options: {
    theme: {
      name: '@z2o/button',
      brandUrl: 'https://github.com/zero-component/button#readme',
      brandTitle: '@z2o/button',
    },
  },
});

configure(loadStories, module)