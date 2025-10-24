module.exports = {
  apps: [
    {
      name: "novamall-prod",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 8080,
        NEXT_PUBLIC_APP_SSL: "yes",
      },
    },
    {
      name: "novamall-stg",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 8080,
        NEXT_PUBLIC_APP_SSL: "no",
      },
    },
  ],
};
