import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
// const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  // req.keys().forEach(filename => req(filename));
  require('/Users/lishuaishuai/Workspace/zero-component/button/storybook/index.js');
  // require('/Users/lishuaishuai/Desktop/test/select/storybook/index.js');

}

configure(loadStories, module);
