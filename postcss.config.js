module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    }),
    require('postcss-url')({ url: 'inline' }),
    require('postcss-discard-comments')({
      removeAll: true
    }),
    require('postcss-nested'),
    require('postcss-custom-properties')({
      preserve: false
    })
  ]
}
