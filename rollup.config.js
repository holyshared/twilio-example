import * as path from "path";
import pluginTypescript from "@rollup/plugin-typescript";

export default {
  input: 'src/client/app.ts',
  output: {
    file: 'public/assets/js/bundle.js',
    format: 'cjs'
  },
  plugins: [
    pluginTypescript({
      tsconfig: path.resolve("./tsconfig.client.json")
    }),
  ]
};
