const path = require('path')
const webpack = require('webpack')
const resolve = require('path').resolve

module.exports = {
    mode: 'production',
    entry: {
        server: './src/server/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.hbs$/,
                loader: "handlebars-loader"
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /express\/lib/,
            resolve('node_modules'),
            {
                'ejs': 'ejs'
            }
        )
    ]
    
}