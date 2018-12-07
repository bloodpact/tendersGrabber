const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: "./app.js",
    output: {
        path: path.resolve(__dirname, './'),
        filename: "bundle.js"
    },
    target: "async-node",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.hbs/,
                loader: 'handlebars-loader',
                exclude: /(node_modules|bower_components)/,
                options: {
                    partialDirs: path.join(__dirname, '../../views/partials')
                }
            }
        ]
    },
    resolve: {
        alias: {
            'express-handlebars': 'handlebars/dist/handlebars.js'
        }
    },
    externals: [nodeExternals({
        whitelist: ['body-parser', 'axios', 'method-override', 'connect-flash', 'express-session']
    })],
}