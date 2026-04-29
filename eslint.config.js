// https://docs.expo.dev/guides/using-eslint /
/*yoh remove this line */
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat'); 

module.exports = defineConfig([
  expoConfig,
  { 
    ignores: ['dist/*'],
    
  },
]);
