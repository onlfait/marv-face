import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

const dev = process.argv.includes("--dev");

export default {
  input: "app/renderer_src/index.js",
  output: {
    file: "app/renderer/bundle.js",
    format: "iife"
  },
  plugins: [resolve({ preferBuiltins: false }), commonjs(), !dev && terser()]
};
