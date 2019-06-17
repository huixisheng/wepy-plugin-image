const path = require('path');
const fs = require('fs');
const mime = require('mime');
// TODO key 没有配置的提示
// TODO 其他平台的cdn支持 又拍云、阿里云等
const packQiniu = require('pack-qiniu');
const validator = require('validator');

class ImageParse {
  constructor(cfg = {}) {
    // TODO filter
    this.config = Object.assign({
      limit: 1024,
      // TODO: 兼容wepy --log trace
      // https://github.com/npm/npmlog/blob/master/log.js#L296-L304
      debugMode: false,
    }, cfg);
  }

  apply(node, ctx) {
    // const { code, file } = op;
    let code = node.compiled.code;
    const file = ctx.file;

    const config = this.config;
    const { debugMode } = config;
    if (debugMode) {
      console.log('\nwepy-plugin-image file:', file);
      // console.log('lessRootpath', lessRootpath);
    }

    const reg = /url\((.*?)\)/gi;
    if (!code) {
      if (debugMode) {
        console.error('code is null');
      }
      return Promise.resolve({ node, ctx });
    }
    const bgPaths = code.match(reg) || [];


    const base64List = [];
    const uploadList = [];
    const bgPathFilter = bgPaths.filter(item => item.indexOf('data:image/svg+xml') < 0 && item.indexOf('http') !== 0);
    if (debugMode) {
      console.log('wepy-plugin-image bgPaths:\n', bgPathFilter);
    }
    bgPathFilter.forEach((item) => {
      const bgImage = item.replace(/'/g, '').replace(/"/g, '').replace('url(', '').replace(/\)$/g, '');
      // 本身是绝对地址
      let bgPath = bgImage;

      if (debugMode) {
        console.log('bgPathSouce:%s\n', bgPath);
      }

      // 绝对地址不存在，使用去除lessRootpath地址的相对地址
      // fix: http的链接不处理
      if (!fs.existsSync(bgPath) && bgPath.indexOf('http') !== 0) {
        bgPath = path.join(path.dirname(file), bgPath);
      }

      // less使用e('')传递的路径
      // if (!fs.existsSync(bgPath)) {
      //   bgPath = path.join(path.dirname(file.replace('dist', 'src')), bgImage);
      // }

      if (debugMode) {
        console.log('bgPathChange:%s\n', bgPath);
      }

      if (!fs.existsSync(bgPath) && debugMode) {
        if (bgPath.indexOf('http') < 0) {
          console.error('%s不存在', bgPath);
        }
      }
      // TODO: https:// 开头的字体
      if (!validator.isURL(bgImage, { require_protocol: true }) && fs.existsSync(bgPath)) {
        const stats = fs.statSync(bgPath);
        if (stats.size > config.limit) {
          uploadList.push({
            path: bgPath,
            bg: bgImage,
          });
        } else {
          base64List.push({
            path: bgPath,
            bg: bgImage,
          });
        }
      } else {
        if (bgPath.indexOf('http') < 0) {
          console.error('不正确的路径', bgPath);
        }
      }
    });

    base64List.forEach((base64file) => {
      const base64Content = fs.readFileSync(base64file.path).toString('base64');
      const mimeType = mime.getType(base64file.path);
      const data = `data:${mimeType};base64,${base64Content}`;
      if (debugMode) {
        console.log('base64 replace');
      }
      code = code.replace(base64file.bg, `${data}`);
    });

    const promiseUploadList = [];
    uploadList.forEach((uploadfile) => {
      promiseUploadList.push(packQiniu(uploadfile.path, uploadfile));
    });
    // 无图片的时候
    if (!promiseUploadList.length) {
      if (debugMode) {
        console.log('wepy-plugin-image no upload image');
      }
      node.compiled.code = code;
      return Promise.resolve({ node, ctx });
    }
    return Promise.all(promiseUploadList).then((resultList) => {
      resultList.forEach((item) => {
        const bgUrl = item.options.bg;
        const uploadUrl = item.url.replace('http://', 'https://');
        code = code.replace(bgUrl, uploadUrl);
      });
      node.compiled.code = code;
      return Promise.resolve({ node, ctx });
    });

    // var pathFile = _path2.default.join(path.dirname(file.replace('dist', 'src')), imgPath);
    //   { type: 'css',
    // code: '.panel {\n  width: 100%;\n  margin-top: 20rpx;\n  text-align: left;\n  font-size: 12px;\n  padding-top: 20rpx;\n  padding-left: 50rpx;\n  padding-bottom: 20rpx;\n  border: 1px solid #ccc;\n}\n.panel .title {\n  padding-bottom: 20rpx;\n  font-size: 14px;\n  font-weight: bold;\n}\n.panel .info {\n  padding: 15rpx;\n}\n.panel .testcounter {\n  margin-top: 15rpx;\n  position: absolute;\n}\n.panel .counterview {\n  margin-left: 120rpx;\n}\n.panel .image {\n  width: 20px;\n  height: 20px;\n  background-image: url(image/icon-super@2x.png);\n}\n',
    // file: '/Users/huixisheng/Workspaces/dist/components/member-card.wxss',
    // output: [Function: output],
    // done: [Function: done],
    // next: [Function],
    // catch: [Function] }
  }
}

// eslint-disable-next-line
exports = module.exports = function (options = {}) {
  return function () {
    this.register('before-wepy-parser-style', ({ node, ctx }) => {
      if (options.debugMode) {
        console.log('before-wepy-parser-style', ctx.file);
      }

      const wepyPluginImageInstance = new ImageParse(options);
      return wepyPluginImageInstance.apply(node, ctx);
    });
  };
};
// node
//   { type: 'style',
//   content: '\n.groupitem {\n}\n',
//   start: 19,
//   attrs: { type: 'less' },
//   end: 35,
//   lang: 'css',
//   compiled: { code: '\n.groupitem {\n}\n' } }

// ctx
// { file: '/Users/huixisheng/Mzxd/mxj-fe/wepy2-mall/src/components/groupitem.wpy',
//   sfc:
//    { template:
//       { type: 'template',
//         content: '\n<div class="groupitem">\n  --<span class="id">{{gitem.childid}}.</span>\n  <span class="name" @tap="tap"> {{gitem.childname}}</span>\n</div>\n',
//         start: 54,
//         attrs: {},
//         end: 201,
//         lang: 'wxml',
//         compiled: [Object],
//         parsed: [Object] },
//      script:
//       { type: 'script',
//         content: '//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\nimport wepy from \'@wepy/core\';\n\nwepy.component({\n  props: {\n    gitem: {}\n  },\n  data: {\n  },\n  methods: {\n    tap () {\n      this.gitem.childname = `Child Random(${Math.random()})`\n      let index = this.$parent.$children.indexOf(this);\n      console.log(`Item ${index}, ID is ${this.gitem.childid}`)\n    }\n  }\n});\n',
//         start: 221,
//         attrs: {},
//         end: 568,
//         lang: 'babel',
//         compiled: [Object],
//         parsed: [Object] },
//      styles: [ [Object] ],
//      customBlocks: [],
//      config: { parsed: [Object] } },
//   type: 'normal',
//   npm: false,
//   component: true }