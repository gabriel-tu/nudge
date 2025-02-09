module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      "@babel/preset-typescript",
    ],
    plugins: [
      ['dotenv-import', {
        moduleName: '@env',
        path: '.env',
      }],
    ],
  };
};
