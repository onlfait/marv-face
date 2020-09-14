#!/usr/bin/env node

const makePackage = require("./modules/makePackage");
const builder = require("electron-builder");
const path = require("path");

async function build() {
  await makePackage({
    from: path.join(__dirname, "../package.json"),
    to: path.join(__dirname, "../app/package.json")
  });

  await builder.build();
}

build();
