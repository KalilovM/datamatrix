/**
 * PM2 Ecosystem Configuration
 *
 * This file configures PM2 process manager for production deployment.
 * PM2 provides: process management, clustering, auto-restart, log management.
 *
 * Usage:
 *   pm2 start ecosystem.config.cjs           # Start application
 *   pm2 reload datamatrix --update-env       # Zero-downtime restart
 *   pm2 stop datamatrix                      # Stop application
 *   pm2 logs datamatrix                      # View logs
 *   pm2 monit                                # Real-time monitoring
 *
 * Environment Variables:
 *   PM2 loads env vars from /etc/datamatrix/.env via env_file option.
 *   Alternatively, set them directly in the env_production block.
 */

const path = require("path");

module.exports = {
  apps: [
    {
      // Application identity
      name: "datamatrix",

      // Start command - using standalone output from next build
      script: "node",
      args: "server.js",
      cwd: path.join(__dirname, ".next/standalone"),

      // Instance configuration
      instances: 1,                    // Single instance (increase for clustering)
      exec_mode: "fork",               // Use "cluster" if instances > 1

      // Process behavior
      autorestart: true,               // Restart on crash
      watch: false,                    // Disable file watching in production
      max_memory_restart: "500M",      // Restart if memory exceeds limit

      // Startup behavior
      wait_ready: true,                // Wait for process.send('ready')
      listen_timeout: 10000,           // Timeout for ready signal (ms)
      kill_timeout: 5000,              // Grace period before SIGKILL (ms)

      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/datamatrix/error.log",
      out_file: "/var/log/datamatrix/out.log",
      merge_logs: true,                // Merge cluster logs into single file
      log_type: "json",                // Structured logging

      // Environment - Production
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },

      // Load additional env vars from file
      // Create this file with your production secrets
      // Format: KEY=value (one per line)
      env_file: "/etc/datamatrix/.env",

      // Health monitoring
      exp_backoff_restart_delay: 100,  // Exponential backoff on crashes
      max_restarts: 10,                // Max restarts within min_uptime
      min_uptime: "10s",               // Minimum uptime to consider "started"

      // Source maps for better error traces
      source_map_support: true,
    },
  ],

  // Deployment configuration (optional - for pm2 deploy)
  deploy: {
    production: {
      user: "deploy",
      host: "your-server-ip",
      ref: "origin/main",
      repo: "git@github.com:your-username/datamatrix.git",
      path: "/var/www/datamatrix",
      "pre-deploy-local": "",
      "post-deploy": "npm ci && export $(cat /etc/datamatrix/.env | xargs) && npm run prod:build && pm2 reload ecosystem.config.cjs --env production",
      "pre-setup": "",
    },
  },
};
