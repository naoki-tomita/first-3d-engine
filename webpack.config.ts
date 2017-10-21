import * as webpack from "webpack";
import * as path from "path";

const config: webpack.Configuration = {
  entry: "./index.ts",
  output: {
    filename: "index.js"
  },
  resolve: {
    extensions: [ ".ts" ]
  },
  module: {
    rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
    ]
  }
};

export default config;