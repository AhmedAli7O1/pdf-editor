'use strict';

const path = require('path');


const vanillajs = {
  entry: './src/pdf-editor-js.js',
  output: {
    filename: 'pdf-editor-js.min.js',
    path: path.resolve(__dirname, 'dist'),
    // library: 'archPDFEditor',
    // libraryTarget: 'var'
  },
  mode: 'production',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};

const angularjs = {
  entry: './src/pdf-editor-ngjs.js',
  output: {
    filename: 'pdf-editor-ngjs.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};

module.exports = [ vanillajs, angularjs ];