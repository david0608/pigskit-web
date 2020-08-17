const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const NAME = process.env.MODULE || 'root'
const MODULE_PATH = path.join(__dirname, `src/${NAME}`)
const PUBLIC_PATH = path.join(__dirname, `dist/public/${NAME === 'root' ? '' : NAME}`)

module.exports = {
    entry: path.join(MODULE_PATH, 'index.js'),
    output: {
        path: PUBLIC_PATH,
        filename: 'index.js'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.jpg$/,
                use: [{loader: 'url-loader'}]
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.join(MODULE_PATH, 'index.html'),
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css'
        }),
        new webpack.DefinePlugin({
            PIGSKIT_RESTFUL_ORIGIN: JSON.stringify(""),
            PIGSKIT_GRAPHQL_ORIGIN: JSON.stringify("")
        })
    ]
}