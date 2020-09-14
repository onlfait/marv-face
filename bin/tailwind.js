#!/usr/bin/env node

const tailwind = require.resolve("tailwindcss/lib/cli.js");
const { fork } = require("child_process");
const path = require("path");

const appPath = path.resolve(__dirname, "../app");
const input = path.resolve(appPath, "renderer_src/tailwind.css");
const output = path.resolve(appPath, "renderer/css/tailwind.css");

const config = path.resolve(__dirname, "config/tailwind.js");

const argv = [...process.argv.slice(2), "--no-autoprefixer"];
const args = ["build", input, "-c", config, "-o", output, ...argv];

fork(tailwind, args, { stdio: ["inherit", "inherit", "inherit", "ipc"] });
