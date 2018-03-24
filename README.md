# wepy-plugin-image

> wepy插件根据图片大小是否转base64、上传七牛

## 配置 ##

[pack-qiniu配置](https://github.com/huixisheng/pack-qiniu)

`wepy.config.js`

```
module.exports.plugins = {
    image: {
      limit: 10240, // 大于10kb
    },
}
```

## TODO  ##
- [ ] 测试用例
- [ ] 去除脚手架生成的webpack?