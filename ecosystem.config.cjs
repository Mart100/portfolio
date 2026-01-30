module.exports = {
  apps: [
    {
      name: 'portfolio',
      script: 'build/index.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 4020,
      }
    }
  ]
};
