const ImageParse = require('../src/index');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('正常数据', function () {
  it('无单引和双引的数据', function (done) {
    const instance = new ImageParse();
    const filepath = path.join(__dirname, 'fixtures/test.wxss');
    const code = fs.readFileSync(filepath, 'utf8');
    const data = {
      code,
      file: filepath,
      next() {
        const expectValue = `.alipay { background-image: url(https://img0.cosmeapp.com/Fg0s0GU_xDPd2rOgAYYikJDTiEhL); }
.icon { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAD1JREFUSA1jYBgFoyEwGgKjITAaAkMuBBhxufjs2bP/cckRI25sbIzVbCZiNI+qGQ2B0RAYDYHREBjhIQAADF0EBNEtJ20AAAAASUVORK5CYII=); }`;
        expect(this.code).to.be.equal(expectValue);
        done();
      },
    };
    instance.apply(data);
  });

  it('单引和双引的数据', function (done) {
    const instance = new ImageParse();
    const filepath = path.join(__dirname, 'fixtures/test2.wxss');
    const code = fs.readFileSync(filepath, 'utf8');
    const data = {
      code,
      file: filepath,
      next() {
        const expectValue = `.alipay { background-image: url("https://img0.cosmeapp.com/Fg0s0GU_xDPd2rOgAYYikJDTiEhL"); }
.icon { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAD1JREFUSA1jYBgFoyEwGgKjITAaAkMuBBhxufjs2bP/cckRI25sbIzVbCZiNI+qGQ2B0RAYDYHREBjhIQAADF0EBNEtJ20AAAAASUVORK5CYII='); }`;
        expect(this.code).to.be.equal(expectValue);
        done();
      },
    };
    instance.apply(data);
  });

  it('debugMode', function (done) {
    const instance = new ImageParse({
      debugMode: true,
    });
    const filepath = path.join(__dirname, 'fixtures/test.wxss');
    const code = fs.readFileSync(filepath, 'utf8');
    const data = {
      code,
      file: filepath,
      next() {
        const expectValue = `.alipay { background-image: url(https://img0.cosmeapp.com/Fg0s0GU_xDPd2rOgAYYikJDTiEhL); }
.icon { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAD1JREFUSA1jYBgFoyEwGgKjITAaAkMuBBhxufjs2bP/cckRI25sbIzVbCZiNI+qGQ2B0RAYDYHREBjhIQAADF0EBNEtJ20AAAAASUVORK5CYII=); }`;
        expect(this.code).to.be.equal(expectValue);
        done();
      },
    };
    instance.apply(data);
  });

  it('code null', function (done) {
    const instance = new ImageParse({
      debugMode: true,
    });
    const filepath = path.join(__dirname, 'fixtures/test.wxss');
    const data = {
      code: null,
      file: filepath,
      next() {
        expect(this.code).to.be.equal(null);
        done();
      },
    };
    instance.apply(data);
  });


  it('no upload image', function (done) {
    const instance = new ImageParse({
      debugMode: true,
    });
    const filepath = path.join(__dirname, 'fixtures/test1.wxss');
    const code = fs.readFileSync(filepath, 'utf8');
    const data = {
      code,
      file: filepath,
      next() {
        const expectValue = `.alipay { width: 20px; height: 20px; }
.icon { display: flex; justify-content: center; align-items: center; }`;
        expect(this.code).to.be.equal(expectValue);
        done();
      },
    };
    instance.apply(data);
  });
});