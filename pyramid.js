const AWS       = require('aws-sdk');
const Sharp     = require('sharp');
const URI       = require('uri-js');
const fetch     = require('node-fetch');
const fs        = require('fs');
const stream    = require('stream');

function createPyramidTiff(source, dest) {
  return new Promise((resolve, reject) => {
    var pipeline = Sharp()
      .limitInputPixels(false)
      .resize({ width: 15000, height: 15000, fit: 'inside', withoutEnlargement: true })
      .tiff({ compression: 'jpeg', quality: 75, tile: true, tileHeight: 256, tileWidth: 256, pyramid: true });

    var outputStream = makeOutputStream(dest).on('finish', () => resolve(dest));
    try {
      makeInputStream(source)
        .catch(err => reject(err))
        .then(inStream => inStream.pipe(pipeline).pipe(outputStream));
    } catch(err) {
      reject(err);
    }
  });
}

function makeInputStream(location) {
  return new Promise((resolve, reject) => {
    var uri = URI.parse(location);
    var readStream;
    switch(uri.scheme) {
      case 'file':
        readStream = fs.createReadStream(uri.path);
        break;
      case 'http':
      case 'https':
        readStream = new stream.PassThrough();
        fetch(location).then((res) => res.body.pipe(readStream));
        break;
      case 's3':
        var s3Key = uri.path.replace(/^\/+/,'');
        readStream = new AWS.S3().getObject({ Bucket: uri.host, Key: s3Key }).createReadStream();
        break;
      default:
        reject(`Unsupported input scheme: '${uri.scheme}'`);
    }
    resolve(readStream);
  });
}

function makeOutputStream(location) {
  var uri = URI.parse(location);
  var writeStream;
  switch(uri.scheme) {
    case 'file':
      writeStream = fs.createWriteStream(uri.path);
      break;
    case 's3':
      writeStream = new stream.PassThrough();
      var s3Key = uri.path.replace(/^\/+/,'');
      new AWS.S3().upload({ Bucket: uri.host, Key: s3Key, Body: writeStream }, (err, _data) => {
        if (err) {
          console.log(err);
          throw err;
        }
      });
      break;
    default:
      throw(`Unsupported output scheme: '${uri.scheme}'`);
  }
  return writeStream;
}

module.exports = { createPyramidTiff }