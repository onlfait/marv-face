import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import svelte from "rollup-plugin-svelte";

const dev = process.argv.includes("--dev");

export default {
  input: "app/renderer_src/index.js",
  output: {
    file: "app/renderer/bundle.js",
    format: "iife"
  },
  plugins: [
    resolve({
      dedupe: ["svelte"],
      preferBuiltins: false
    }),
    commonjs(),
    svelte({ dev }),
    !dev && terser()
  ]
};
