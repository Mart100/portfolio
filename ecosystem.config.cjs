module.exports = {
  apps: [
    {
      name: 'portfolio',
      script: 'build/index.js',
      interpreter: 'bun',
      env: {
        NODE_ENV: 'production',
        PORT: 4020,
      }
    }
  ]
};
