/**
 * PM2 Ecosystem Configuration
 *
 * This file is shared by both server environments.
 * Runtime identity and ports are injected by scripts/deploy.sh.
 */

const path = require("path");
const appName = process.env.DATAMATRIX_PM2_APP_NAME || "datamatrix";
const logDir = process.env.DATAMATRIX_LOG_DIR || "/var/log/datamatrix";
const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || "127.0.0.1";
const appEnv = process.env.APP_ENV || "prod";

module.exports = {
  apps: [
    {
      name: appName,

      script: "node",
      args: "server.js",
      cwd: path.join(__dirname, ".next/standalone"),

      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      watch: false,
      max_memory_restart: "500M",

      wait_ready: false,
      kill_timeout: 5000,

      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: path.join(logDir, "error.log"),
      out_file: path.join(logDir, "out.log"),
      merge_logs: true,
      log_type: "json",

      env: {
        NODE_ENV: "production",
        APP_ENV: appEnv,
        PORT: port,
        HOSTNAME: hostname,
        DATAMATRIX_PM2_APP_NAME: appName,
        DATAMATRIX_LOG_DIR: logDir,
      },

      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: "10s",

      source_map_support: true,
    },
  ],
};
