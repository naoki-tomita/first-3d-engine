import * as webpack from "webpack";
import * as path from "path";

const config: webpack.Configuration = {
  entry: "./index.ts",
  output: {
    filename: "index.js"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
};

export default config;