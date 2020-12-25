const sharp = require('sharp');
const uuidv4 = require('uuid').v4;
const path = require('path');
var fs = require('fs');

class Resize {
  constructor(folder, name = null) {
    this.folder = folder;
    this.name = name;
  }
  async save(buffer) {
    const filename = `${this.name}.png` ?? Resize.getRandFileName();
    const filepath = this.getFilePath(filename);

    await sharp(buffer)
      .resize(320, 400, {
        fit: sharp.fit.cover,
        withoutEnlargement: true,
      })
      .toFile(filepath);

    return path.join('public', 'images', filename);
  }

  static getRandFileName() {
    // random file name
    return `${uuidv4()}.png`;
  }

  getFilePath(filename) {
    var dir = this.folder;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    if (!fs.existsSync(path.join(dir, 'images'))) {
      fs.mkdirSync(path.join(dir, 'images'));
    }
    return path.resolve(path.join(this.folder, 'images', filename));
  }
}
module.exports = Resize;
