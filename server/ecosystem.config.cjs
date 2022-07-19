module.exports = {
  apps: [
    {
      name: 'iblock-server',
      script: './src/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
        // DEBUG: '*',
      },
      node_args: '--experimental-modules --experimental-specifier-resolution=node',
    },
  ],
}
