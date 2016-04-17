/* global fis */


//less编译
fis.match('*.less', {
  // fis-parser-less 插件进行解析
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css',
  useSprite : true,
  optimizer : fis.plugin('clean-css')
});
//sass编译
fis.match('*.scss', {
  // fis-parser-sass 插件进行解析
  parser: fis.plugin('sass'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css'
});


fis.match('*.css', {
    useSprite : true,
    optimizer : fis.plugin('clean-css')
});
fis.config.set('settings.spriter.csssprites', {
    //图之间的边距
    margin: 10,
    //使用矩阵排列方式，默认为线性`linear`
    layout: 'matrix'
});

fis.match('*.png', {
    optimizer : fis.plugin('png-compressor')
}); 
fis.match('::packager', {
  // postpackager: fis.plugin('loader'),
    spriter : fis.plugin('csssprites')
});

// // 启用插件
// fis.hook('relative');

// // 让所有文件，都使用相对路径。
// fis.match('**', {
//   relative: true
// })

//线上打包
fis
  .media('production')
  .match('/**.js', {
    // 通过 uglify 压缩 js
    optimizer: fis.plugin('uglify-js')
  })
  // 启用 fis-spriter-csssprites 插件
  .match('::package', {
    spriter: fis.plugin('csssprites')
  })
  // 对 CSS 进行图片合并
  .match('*.{css,less}', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
  })
  .match('*.png', {
    useHash: false,
    useSprite: false,
    optimizer: null
  })
  //CSS压缩
  .match('*.{less,css}', {
    optimizer: fis.plugin('clean-css')
  })
  //使用hash
  .match('*.{js,css,jpg,png,less,gif,svg,eot,ttf,woff,woff2}', {
    useHash: true
  });
