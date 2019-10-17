#!/usr/bin/env node

const AWS      = require('aws-sdk');
const pyramid  = require('./pyramid');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

if (process.env['ECS_CONTAINER_METADATA_FILE']) {
  var instanceMetadata = require(process.env['ECS_CONTAINER_METADATA_FILE']);
  var awsRegion = instanceMetadata.ContainerInstanceARN.split(/:/)[3];
  AWS.config.update({region: awsRegion});
}

if (process.env['AWS_S3_ENDPOINT']) {
  AWS.config.s3 = {endpoint: process.env['AWS_S3_ENDPOINT'], s3ForcePathStyle: true}
}

rl.on('line', function(line){
  var [source, target] = line.split(/\s+/, 2);
  pyramid.createPyramidTiff(source, target)
  .catch(err => {
    process.stdout.write(`ERROR:${err.message}`)
  })
  .then(dest => {
    process.stdout.write(dest)
  })
})
