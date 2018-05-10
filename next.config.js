const path = require('path')
const webpack = require('webpack')

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    //MyHack: only save node_modules files in static/commons/main-[chunkhash].js
    if (!isServer && !dev) {
      for (plugin of config.plugins) {
        if (plugin['constructor']['name'] === 'CommonsChunkPlugin'
          && plugin.filenameTemplate == "static/commons/main-[chunkhash].js") {
          plugin.minChunks = function (module, count) {
            var needChunk = (
              module.resource &&
              // /\.js$/.test(module.resource) &&
              module.resource.indexOf(
                path.join(__dirname, './node_modules')
              ) === 0
            )
            if (needChunk) {
              // console.log("needChunk = ", module.resource)
            }
            return needChunk
          }
          break;
        }
      }
    }
    return config
  },
}