#!/usr/bin/env node
/**
 * UniApply / ApplyDirect SA — Cross-platform launcher.
 *
 * Starts EVERYTHING (MySQL check, dependency install, database setup and all
 * four servers) on Windows, macOS and Linux — the same as START-ALL.bat used
 * to do on Windows only.
 *
 *   npm start              -> starts everything (all 4 apps)
 *   npm run start:sub      -> subscription API (3002) + site (3004) only
 *   npm run start:admin    -> admin API (3003) + site (3005) only
 *   npm run db:setup       -> only makes sure MySQL + database are ready
 *
 * Requirements: Node.js 18+ and MySQL/MariaDB exposed on port 3307
 * (XAMPP on Windows). Uses only Node built-ins, no npm install needed here.
 */
import { spawn, spawnSync, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import net from "net";
import os from "os";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PID_FILE = path.join(ROOT, "uniapply.pids.json");
const LOG_DIR = path.join(ROOT, "logs");

const APPS = [
  { name: "Student API", port: 3000, dir: "backend", type: "backend" },
  { name: "Student Site", port: 5173, dir: "frontend", type: "frontend" },
  {
    name: "Subscription API",
    port: 3002,
    dir: "sections/subscription/backend",
    type: "backend",
  },
  {
    name: "Admin API",
    port: 3003,
    dir: "sections/admin/backend",
    type: "backend",
  },
  {
    name: "Subscription Site",
    port: 3004,
    dir: "sections/subscription/frontend",
    type: "frontend",
  },
  {
    name: "Admin Site",
    port: 3005,
    dir: "sections/admin/frontend",
    type: "frontend",
  },
];

const args = process.argv.slice(2);
const onlySub = args.includes("--sub");
const onlyAdmin = args.includes("--admin");
const dbOnly = args.includes("--db-only");

function activeApps() {
  if (onlySub) return APPS.filter((a) => a.name.startsWith("Subscription"));
  if (onlyAdmin) return APPS.filter((a) => a.name.startsWith("Admin"));
  return APPS;
}

function log(msg, newline = true) {
  process.stdout.write(`[UniApply] ${msg}${newline ? "\n" : ""}`);
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function portOpen(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const sock = net.connect({ port, host });
    sock.setTimeout(2000);
    sock.once("connect", () => {
      sock.destroy();
      resolve(true);
    });
    sock.once("timeout", () => {
      sock.destroy();
      resolve(false);
    });
    sock.once("error", () => resolve(false));
  });
}

async function waitForPort(port, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await portOpen(port)) return true;
    await delay(1200);
  }
  return false;
}

function getLanIP() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return null;
}

function killPid(pid) {
  if (!pid) return;
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    /* already dead */
  }
  if (process.platform === "win32") {
    try {
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" });
    } catch {
      /* ignore */
    }
  }
}

function stopOld() {
  if (!fs.existsSync(PID_FILE)) return;
  log("Stopping old UniApply instances...");
  try {
    const pids = JSON.parse(fs.readFileSync(PID_FILE, "utf8"));
    for (const p of pids) killPid(p.pid);
  } catch {
    /* ignore corrupt file */
  }
  try {
    fs.unlinkSync(PID_FILE);
  } catch {
    /* ignore */
  }
  log("Old instances stopped.");
}

async function ensureMySQL() {
  if (await portOpen(3307)) {
    log("MySQL is already running on port 3307.");
    return true;
  }
  log("MySQL not running on port 3307. Trying to start it...");

  if (process.platform === "win32") {
    const mysqld = "C:\\xampp\\mysql\\bin\\mysqld.exe";
    if (fs.existsSync(mysqld)) {
      const child = spawn(
        mysqld,
        [
          "--port=3307",
          "--basedir=C:\\xampp\\mysql",
          "--datadir=C:\\xampp\\mysql\\data",
        ],
        { stdio: "ignore", detached: true, windowsHide: true },
      );
      child.unref();
      log("XAMPP MariaDB starting on port 3307 (in background).");
    } else {
      log(
        "ERROR: XAMPP not found at C:\\xampp. Please start MySQL/MariaDB on port 3307 yourself.",
      );
      return false;
    }
  } else {
    try {
      execSync(
        "mysql.server start 2>/dev/null || service mysql start 2>/dev/null || service mariadb start 2>/dev/null",
        { shell: true, stdio: "ignore" },
      );
    } catch {
      /* error is handled by the port check below */
    }
    log(
      "Attempted to start MySQL/MariaDB. If it is not running, start it yourself on port 3307 before re-running this script.",
    );
  }

  if (await waitForPort(3307, 30000)) {
    log("MySQL is now ready on port 3307.");
    return true;
  }
  log(
    "ERROR: MySQL did not start on time. Verify MySQL is configured to listen on port 3307, then re-run. Windows users: install/start XAMPP.",
  );
  return false;
}

function runNpm(cwdRel, npmArgs) {
  const cwd = path.join(ROOT, cwdRel);
  const cmd = process.platform === "win32" ? "npm.cmd" : "npm";
  return spawnSync(cmd, npmArgs, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

function ensureDeps(app) {
  if (fs.existsSync(path.join(ROOT, app.dir, "node_modules"))) return true;
  log(`Installing dependencies for ${app.name} (first run, needs internet)...`);
  return runNpm(app.dir, ["install"]).status === 0;
}

function databaseBackends() {
  if (onlySub) return ["sections/subscription/backend"];
  if (onlyAdmin) return ["sections/admin/backend"];
  return ["backend", "sections/subscription/backend", "sections/admin/backend"];
}

function runDbSetup() {
  for (const backend of databaseBackends()) {
    log(`Setting up database (${backend})...`);
    const res = runNpm(backend, ["run", "db:setup"]);
    if (res.status !== 0) {
      log(`ERROR: Database setup failed in ${backend}.`);
      return false;
    }
  }
  return true;
}

function startDaemon(app) {
  const cwd = path.join(ROOT, app.dir);
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logPath = path.join(
    LOG_DIR,
    app.name.replace(/\s+/g, "-").toLowerCase() + ".log",
  );
  const outFd = fs.openSync(logPath, "a");

  const script =
    app.type === "backend"
      ? path.join(cwd, "server.js")
      : path.join(cwd, "node_modules", "vite", "bin", "vite.js");

  if (!fs.existsSync(script)) {
    log(
      `ERROR: Cannot find ${script}. Run "npm install" in that folder, or run the launcher once more.`,
    );
    try {
      fs.closeSync(outFd);
    } catch {
      /* ignore */
    }
    return null;
  }

  const child = spawn(process.execPath, [script], {
    cwd,
    detached: true,
    stdio: ["ignore", outFd, outFd],
    windowsHide: true,
  });
  child.unref();
  try {
    fs.closeSync(outFd);
  } catch {
    /* ignore */
  }
  log(
    `Started ${app.name} (pid ${child.pid}) -> log: ${path.relative(ROOT, logPath)}`,
  );
  return { name: app.name, pid: child.pid, port: app.port };
}

function writePids(entries) {
  fs.writeFileSync(PID_FILE, JSON.stringify(entries, null, 2));
}

function printSummary(lanIP) {
  log("\n============================================================");
  log("  All done! Things are starting up or already running.");
  log("  (Give Vite a few seconds to compile the first page.)");
  log("");
  log("  On THIS computer:");
  log("    Student site      : http://localhost:5173");
  log("    Subscription site : http://localhost:3004");
  log("    Admin site        : http://localhost:3005");
  if (lanIP) {
    log("");
    log("  On OTHER devices (phones/tablets on the same Wi-Fi):");
    log(`    Student site      : http://${lanIP}:5173`);
    log(`    Subscription site : http://${lanIP}:3004`);
    log(`    Admin site        : http://${lanIP}:3005`);
    log("  (The API is proxied automatically — no config needed.)");
  }
  log("");
  log("  Demo student  : thabo@email.com / password123");
  log("  Admin account : admin@uniapply.co.za / admin123");
  log("  To stop everything later, run:  npm stop   (or STOP-ALL)");
  log("============================================================\n");
}

async function main() {
  log("========== ApplyDirect SA - Start Everything ==========");
  log("Stopping old instances...");
  stopOld();

  const lanIP = getLanIP();

  if (!dbOnly) {
    if (!(await ensureMySQL())) process.exit(1);
  }

  const apps = dbOnly ? [] : activeApps();

  if (dbOnly) {
    for (const b of databaseBackends()) {
      if (!ensureDeps({ name: b, dir: b })) process.exit(1);
    }
    if (!runDbSetup()) process.exit(1);
    log("Database is ready.");
    return;
  }

  for (const app of apps) {
    if (!ensureDeps(app)) {
      log(`ERROR: Dependencies could not be installed for ${app.name}.`);
      process.exit(1);
    }
  }
  log("All dependencies are present.");

  if (!runDbSetup()) process.exit(1);

  const pids = [];
  for (const app of apps) {
    const entry = startDaemon(app);
    if (entry) pids.push(entry);
    await delay(1500);
  }

  for (const entry of pids) {
    const ok = await waitForPort(entry.port, 45000);
    log(`${ok ? "OK   " : "FAIL "} ${entry.name} on port ${entry.port}`);
  }

  writePids(pids);
  printSummary(lanIP);
}

main();
