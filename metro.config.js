// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs'); // Add 'cjs' to the list of source extensions
defaultConfig.resolver.unstable_enablePackageExports = false;
module.exports = defaultConfig;
