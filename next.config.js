const path = require('path');

/*****************************************************************************
 * SET YOUR CONFIGURATION HERE
 *****************************************************************************/

// Set base path if your static app does not start from root
const basePath = '/qr-code-generator'; // '/spa-github-page-template'

// Set any other dynamic routes in pages
const dynamicRoutes = {
  
}

/*****************************************************************************
 *****************************************************************************/

const webpackBasePath = process.env.SPA_EXP_BUILD === 'true' ? basePath : ''

module.exports = {
  publicRuntimeConfig: {
    basePath: webpackBasePath,
  },
  assetPrefix: webpackBasePath,
  exportPathMap: async function(defaultPathMap) {
    return Object.assign({}, defaultPathMap, dynamicRoutes);
  },
  webpack: function(config) {
    config.module.rules.push(
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            fallback: 'file-loader',
            publicPath: `${webpackBasePath}/_next/static/images/`,
            outputPath: 'static/images/',
            name: '[name].[hash:15].[ext]',
          },
        },
      }
    );

    config.resolve.alias['@styles'] = path.join(__dirname, 'styles');
    config.resolve.alias['@helpers'] = path.join(__dirname, 'helpers');
    config.resolve.alias['@images'] = path.join(__dirname, 'images');

    return config;
  },
};