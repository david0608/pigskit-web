const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NAME = process.env.MODULE || 'main';
const MODULE_PATH = path.join(__dirname, `src/${NAME}`);
const PIGSKIT_RESTFUL_ORIGIN = process.env.REST_SERVER_PORT ? `http://localhost:${process.env.REST_SERVER_PORT}` : '';
const PIGSKIT_GRAPHQL_ORIGIN = process.env.GRAPHQL_SERVER_PORT ? `http://localhost:${process.env.GRAPHQL_SERVER_PORT}` : '';

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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(MODULE_PATH, 'index.html')
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css'
        }),
        new webpack.DefinePlugin({
            PIGSKIT_RESTFUL_ORIGIN: JSON.stringify(PIGSKIT_RESTFUL_ORIGIN),
            PIGSKIT_GRAPHQL_ORIGIN: JSON.stringify(PIGSKIT_GRAPHQL_ORIGIN)
        })
    ]
}