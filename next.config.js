require('dotenv').config()
const Dotenv = require('dotenv-webpack')

const path = require('path')

module.exports = {
  poweredByHeader: false,
  webpack: (config, options) => {

    config.resolve.alias['~components'] = path.join(__dirname, 'components')
    config.resolve.alias['~utils'] = path.join(__dirname, 'utils')
    config.resolve.alias['~static'] = path.join(__dirname, 'static')
    config.resolve.alias['~lib'] = path.join(__dirname, 'lib')
    config.resolve.alias['~modules'] = path.join(__dirname, 'modules')

    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]

    return config
  },
  pageExtensions: ["page.tsx", "api.ts"],
}
