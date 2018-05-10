# react-nextjs-mobx-material-ui
SSR react app with mobx and material-ui

https://github.com/zeit/next.js/issues/4321

I don't kown why the NextJs team disable `manifest.js` in production build. That makes the `.next\static\commons\main-xxxxxx.js` 400+KB file create new one at every yarn build. Then the client need download `main-xxx.js` again and again for each build. (Because disalbed manifest.js, those building runtime info will be compile to `main-xxx.js`, lead `main-xxx.js` change every time)

After long time digging, for anyone who want cache node_modules, only build for your code changes and keep HTTP cache works, follow those steps:

Make sure you are using `"next": "6.0.1-canary.2"`

1, make `.next\static\commons\main-xxx.js` only chunk node_modules. create `next.config.js` in your project, write:
```
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
```
2, enable build manifest in production, at `node_modules\next\dist\server\document.js`, line 351:
```
//MyHack: enable manifest.js to prevent main.js change, main.js stand for node_modules now
// dev && !isServer && new _webpack.default.optimize.CommonsChunkPlugin({
!isServer && new _webpack.default.optimize.CommonsChunkPlugin({
```
3, enable use manifest in production, at `node_modules\next\dist\server\document.js`, line 271:
```
//MyHack: enable manifest.js to prevent main.js change, main.js stand for node_modules now
if (!dev) {
  return (0, _toConsumableArray2.default)(this.getChunkScript('manifest.js')).concat((0, _toConsumableArray2.default)(this.getChunkScript('main.js', {
    async: true
  })));
}
```
4, enable HTTP cache immutable for `.next\static\commons\*`, at `node_modules\next\dist\server\index.js`, line 554:
```
//MyHack: Cache static/commons/* aggressively in production
 //because the file names already have chunkhash main-xxxxxxx.js
if (!_this3.dev && params.path[0] === 'commons') {
  res.setHeader('Cache-Control', 'max-age=31536000, immutable');
}
```
5, Try modify some code in you pageX.js, then `yarn build` and `yarn start`. Check the network status. Repeat it. You will find the 400+KB `main-xxx.js` only create and download at first time, later it always use cache.

After those steps, your upper layer code change won't effect `commons\main-xxx.js` (if you change something in `node_modules`, `main-xxx.js` will create a new one). If your dependent library is stable, so `main-xxx.js` is stable, each time you build new code, client only need download a few KB file(page files js).