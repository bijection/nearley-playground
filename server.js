var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./webpack.config.dev');
var port = 4321

config.entry.client.unshift("webpack-dev-server/client?http://localhost:"+port+"/");

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
});

console.log('listening on localhost:' + port)

server.listen(port);