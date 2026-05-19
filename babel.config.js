module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@features': './src/features',
          '@navigation': './src/navigation',
          '@theme': './src/theme',
          '@components': './src/components',
        },
      },
    ],
  ],
};
