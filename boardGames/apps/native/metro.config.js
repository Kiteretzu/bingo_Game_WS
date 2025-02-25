// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
    ...config.transformer,
    unstable_transformProfile: 'hermes-stable', // Ensure this matches Expo Router expectations
};

module.exports = config;