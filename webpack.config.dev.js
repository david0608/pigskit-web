const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NAME = process.env.MODULE || 'main';
const MODULE_PATH = path.join(__dirname, `src/${NAME}`);

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
        })
    ]
}