# wepy-plugin-image

> wepy插件根据图片大小转base64或者上传七牛

## 配置 ##

[pack-qiniu配置](https://github.com/huixisheng/pack-qiniu)

`wepy.config.js`

```
module.exports.plugins = {
  image: {
    debugMode, // 用于显示调试显示
    limit: 10240, // 大于10kb
  },
}
```

## TODO  ##
- [x] 测试用例
- [x] 去除脚手架生成的webpack