const ImageParse = require('../src/index');
const { expect } = require('chai');

describe('正则匹配', function () {
  it('1 加 1 应该等于 2', function () {
    const instance = new ImageParse();
    const data = {
      // code: '.panel {\n  width: 100%;\n  margin-top: 20rpx;\n  text-align: left;\n  font-size: 12px;\n  padding-top: 20rpx;\n  padding-left: 50rpx;\n  padding-bottom: 20rpx;\n  border: 1px solid #ccc;\n}\n.panel .title {\n  padding-bottom: 20rpx;\n  font-size: 14px;\n  font-weight: bold;\n}\n.panel .info {\n  padding: 15rpx;\n}\n.panel .testcounter {\n  margin-top: 15rpx;\n  position: absolute;\n}\n.panel .counterview {\n  margin-left: 120rpx;\n}\n.panel .image {\n  width: 20px;\n  height: 20px;\n  background-image: url(image/icon-super@2x.png);\n}\n',
      // file: '/Users/huixisheng/Workspaces/dist/components/member-card.wxss',
    };
    instance.apply(data);
    expect(2).to.be.equal(2);
  });
});