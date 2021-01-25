const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Specify the module name, or uses `main` as default.
const NAME = process.env.MODULE || 'main'
const MODULE_PATH = path.join(__dirname, `src/${NAME}`)
const PUBLIC_PATH = path.join(__dirname, `dist/public/${NAME === 'main' ? '' : NAME}`)

module.exports = {
    mode: 'production',
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
        new MiniCssExtractPlugin({
            filename: 'index.css'
        }),
    ]
}