const electron = require("electron");
const { spawn } = require("child_process");

let electronApp = null;

function isLaunched() {
  return electronApp && electronApp.connected;
}

function send(...args) {
  electronApp && electronApp.send(...args);
}

function exit() {
  console.log(`[electron] Exit electron app...`);
  send({ type: "exit", code: 42 });
}

function launch(args) {
  if (isLaunched()) return;

  console.log("[electron] Starting electron app...");

  electronApp = spawn(electron, args, {
    stdio: ["inherit", "inherit", "inherit", "ipc"]
  });

  electronApp.on("exit", code => {
    console.log(`[electron] Electron app exited (code: ${code})`);
    electronApp = null;
    if (code === 42) {
      launch(args);
    }
  });
}

module.exports = { isLaunched, launch, send, exit };
