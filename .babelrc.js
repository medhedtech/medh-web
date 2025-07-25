module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: {
            node: '20'
          }
        }
      }
    ]
  ],
  plugins: [
    // Add any additional plugins if needed
  ],
  env: {
    production: {
      plugins: [
        // Production-specific plugins
      ]
    },
    development: {
      // Development-specific configuration
    }
  }
}; 