/* eslint-disable import/no-extraneous-dependencies */
const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config) {
  // ES6 tree shake for antd.
  const confWithBabelImport = injectBabelPlugin(
    ['import', { libraryName: 'antd', libraryDirectory: 'es' }],
    config,
  );

  return confWithBabelImport;
};
