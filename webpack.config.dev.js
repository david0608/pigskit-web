const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Specify the module name, or uses `root` as default.
const NAME = process.env.MODULE || 'root'
const MODULE_PATH = path.join(__dirname, `src/${NAME}`)
// Specify Pigskit RESTful server origin if `REST_SERVER_PORT` provided.
const PIGSKIT_RESTFUL_ORIGIN = process.env.REST_SERVER_PORT ? `http://localhost:${process.env.REST_SERVER_PORT}` : ''
// Specify Pigskit GraphQL server origin if `GRAPHQL_SERVER_PORT` provided.
const PIGSKIT_GRAPHQL_ORIGIN = process.env.GRAPHQL_SERVER_PORT ? `http://localhost:${process.env.GRAPHQL_SERVER_PORT}` : ''

module.exports = {
    mode: 'development',
    entry: path.join(MODULE_PATH, 'index.js'),
    output: {
        filename: 'index.js'
    },
    devServer: {
        port: 3000,
        contentBase: MODULE_PATH,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.jpg$/,
                use: ['url-loader']
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/src/dev.html')
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css'
        }),
        new webpack.DefinePlugin({
            // Define Pigskit RESTful origin as global variable.
            PIGSKIT_RESTFUL_ORIGIN: JSON.stringify(PIGSKIT_RESTFUL_ORIGIN),
            // Define Pigskit GraphQL origin as global variable.
            PIGSKIT_GRAPHQL_ORIGIN: JSON.stringify(PIGSKIT_GRAPHQL_ORIGIN)
        })
    ]
}