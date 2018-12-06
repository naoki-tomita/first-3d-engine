import * as webpack from "webpack";
import * as path from "path";

const config: webpack.Configuration = {
  entry: "./index.ts",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
  },
  resolve: {
    extensions: [ ".ts", ".json" ],
  },
  module: {
    rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        { test: /\.tsx?$/, loader: "ts-loader" },
    ]
  },
  mode: "development",
};

export default config;