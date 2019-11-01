const webpack = require('webpack')
const path = require('path')
const config = require('sapper/config/webpack.js')
const pkg = require('./package.json')
const createMinifier = require('css-loader-minify-class')
const WebpackMergeAndIncludeGlobally = require('webpack-merge-and-include-globally')
const postcss = require('postcss')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const postCSSConfigs = require('./postcss.config')

const alias = { svelte: path.resolve('node_modules', 'svelte') }
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html']
const mainFields = ['svelte', 'module', 'browser', 'main']

const cssLoaderOptions = {
  modules: {
    localIdentName: '[hash:2]',
    getLocalIdent: createMinifier({
      prefix: '_'
    })
  },
  importLoaders: true
}

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: { alias, extensions, mainFields },
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              dev,
              hydratable: true,
              hotReload: false // pending https://github.com/sveltejs/svelte/issues/2377
            }
          }
        },
        {
          test: /\.s[ac]ss$/,
          use: ['css-loader', 'sass-loader']
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../../../static',
                hmr: dev
              }
            },
            {
              loader: 'css-loader',
              options: cssLoaderOptions
            },
            'postcss-loader'
          ]
        }
      ]
    },
    mode,
    plugins: [
      // pending https://github.com/sveltejs/svelte/issues/2377
      // dev && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      new WebpackMergeAndIncludeGlobally({
        files: [
          {
            src: [path.join(__dirname, 'node_modules/nprogress/nprogress.css')],
            dest: async code => {
              const { css } = await postcss(postCSSConfigs).process(code)
              return {
                [`../../../static/css/app.css`]: css
              }
            }
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false
      })
    ].filter(Boolean),
    devtool: dev && 'inline-source-map'
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: 'node',
    resolve: { alias, extensions, mainFields },
    externals: Object.keys(pkg.dependencies).concat('encoding'),
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              css: true,
              generate: 'ssr',
              dev
            }
          }
        },
        {
          test: /\.s[ac]ss$/,
          use: ['css-loader', 'sass-loader']
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'css-loader',
              options: cssLoaderOptions
            },
            'postcss-loader'
          ]
        }
      ]
    },
    mode: process.env.NODE_ENV,
    performance: {
      hints: false // it doesn't matter if server.js is large
    }
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode: process.env.NODE_ENV
  }
}
