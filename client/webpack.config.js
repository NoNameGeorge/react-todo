const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopeWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new CssMinimizerWebpackPlugin()
        ]
    }

    return config
}

const filename = (extension) => isDev ? `[name].${extension}` : `[name].[hash].${extension}`

const babelOptions = (...presets) => {
    const options = {
        presets: [
            '@babel/preset-env'
        ]
    }

    if (presets.length) {
        options.presets.push(...presets)
    }

    return options
}

const pluguins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './assets/index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        })
    ]

    if (isProd) {
        base.push(new BundleAnalyzerPlugin())
    }

    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.tsx'],
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
    },
    optimization: optimization(),
    devServer: {
        port: 3000,
        historyApiFallback: true,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : false,
    plugins: pluguins(),
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|wof2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions()
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            },
        ]
    }
}
