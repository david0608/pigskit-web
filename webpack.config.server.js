const path = require('path')
const webpack = require('webpack')
const resolve = require('path').resolve

module.exports = (env, argv) => {
    return ({
        entry: {
            server: './src/server/index.js',
        },
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
            filename: '[name].js'
        },
        mode: argv.mode,
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
    })
}