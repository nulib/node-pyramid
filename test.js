import pyramid from './pyramid';

fileDest = 'file:///Users/mbk836/Workspace/node-pyramid/4g-pyramid.tif';
s3Dest = 's3://stack-s-pyramid-tiffs/4g-pyramid.tif';

fileSource = 'file:///Users/mbk836/Downloads/vips/4G.tif';
s3Source = 's3://stack-s-fedora-binaries/1d1dc5f6200e50b8633aec39f8f702fab4e7c708';

pyramid.createPyramidTiff(fileSource, fileDest)
  .then(result => console.log(result))
  .catch(err => console.log(err));