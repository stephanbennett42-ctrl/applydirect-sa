#!/usr/bin/env node
/**
 * UniApply / ApplyDirect SA — Cross-platform stop script.
 * Kills the four servers started by start.js (Windows, macOS, Linux).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const PID_FILE = path.join(ROOT, 'uniapply.pids.json')

function killPid(pid) {
  if (!pid) return
  try { process.kill(pid, 'SIGTERM') } catch { /* already dead */ }
  if (process.platform === 'win32') {
    try { execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' }) } catch { /* ignore */ }
  }
}

let count = 0
if (fs.existsSync(PID_FILE)) {
  try {
    const pids = JSON.parse(fs.readFileSync(PID_FILE, 'utf8'))
    for (const p of pids) {
      console.log(`[UniApply] Stopping ${p.name} (pid ${p.pid})...`)
      killPid(p.pid)
      count++
    }
  } catch (err) {
    console.log('[UniApply] Pid file could not be read:', err.message)
  }
  try { fs.unlinkSync(PID_FILE) } catch { /* ignore */ }
}

console.log(count > 0
  ? `[UniApply] Stopped ${count} UniApply process(es).`
  : '[UniApply] Nothing to stop (no running UniApply processes tracked).')

console.log('[UniApply] MySQL on port 3307 is left running - close it from XAMPP / your DB tool if needed.')