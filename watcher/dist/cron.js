"use strict";
/**
 * Cron runner — runs the watcher every 5 minutes.
 * Usage: npm run cron
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
async function run() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Cron: starting watcher cycle`);
    try {
        const { stdout, stderr } = await execAsync("node dist/index.js", { cwd: __dirname + "/.." });
        if (stdout)
            process.stdout.write(stdout);
        if (stderr)
            process.stderr.write(stderr);
        console.log(`[${new Date().toISOString()}] Cron: cycle complete`);
    }
    catch (err) {
        const error = err;
        console.error(`[${new Date().toISOString()}] Cron: error —`, error?.message ?? err);
    }
}
// Run immediately on start
run();
// Then every 5 minutes
setInterval(run, INTERVAL_MS);
console.log(`Watcher cron started — will run every ${INTERVAL_MS / 1000 / 60} minutes`);
