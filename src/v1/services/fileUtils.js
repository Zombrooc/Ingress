require('dotenv').config();
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage');

class FileUtils{
  slugfy (str){
    return str.toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }

  uploadFile (imageName, imageContent, mimetype, next) {
    const [name, extension] = imageName.split('.');

    const fileName = `${crypto.randomBytes(16).toString('hex')}-${this.slugfy(name)}.${extension}`;
    const storage = new Storage({
      keyFile: 'TheSimple-20360ed55d69.json',
      keyFilename: 'TheSimple-20360ed55d69.json'
    });

    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: mimetype
      }
    });

    blobStream
      .on('error', err => {
        next(err)
      })
      .on('finish', () => {})
      .end(imageContent);

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    return publicUrl;
  }

  async deleteFile (fileName){
    const storage = new Storage({
      keyFile: 'TheSimple-20360ed55d69.json',
      keyFilename: 'TheSimple-20360ed55d69.json'
    });

    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
    await bucket.file(fileName).delete();
  }
}

module.exports = FileUtils;