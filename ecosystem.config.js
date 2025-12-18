module.exports = {
  apps: [
    {
      name: "aynbeauty",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/aynbeauty-error.log",
      out_file: "./logs/aynbeauty-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Graceful shutdown
      kill_timeout: 30000,
      wait_ready: true,
      listen_timeout: 10000,

      // Health check
      health_check: {
        protocol: "http",
        host: "localhost",
        port: 3000,
        path: "/api/health",
        interval: 30000, // every 30 seconds
        max_failures: 5,
      },

      // Restart strategies
      max_restarts: 10,
      min_uptime: 10000, // 10 seconds minimum uptime before restart counts

      // Process event handlers
      events: {
        restart: "echo 'App restarted'",
        reload: "echo 'App reloaded'",
        stop: "echo 'App stopped'",
        exit: "echo 'App exited'",
        "restart overlimit": "echo 'PM2 restart limit exceeded'",
      },
    },
  ],

  // Clustering (optional - use if running on multi-core)
  // instances: 'max',
  // exec_mode: 'cluster',

  // Global options
  error_file: "./logs/pm2-error.log",
  out_file: "./logs/pm2-out.log",
  log_date_format: "YYYY-MM-DD HH:mm:ss Z",
};
