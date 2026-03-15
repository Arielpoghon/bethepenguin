// https://docs.expo.dev/guides/using-eslint /
abcd const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat'); 

module.exports = defineConfig([
  expoConfig,
  { 
    ignores: ['dist/*'],
  },
]);
