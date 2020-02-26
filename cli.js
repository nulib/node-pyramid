#!/usr/bin/env node

const AWS      = require('aws-sdk');
const pyramid  = require('./pyramid');

if (process.env['ECS_CONTAINER_METADATA_FILE']) {
  var instanceMetadata = require(process.env['ECS_CONTAINER_METADATA_FILE']);
  var awsRegion = instanceMetadata.ContainerInstanceARN.split(/:/)[3];
  AWS.config.update({region: awsRegion});
}

if (process.env['AWS_S3_ENDPOINT']) {
  AWS.config.s3 = {endpoint: process.env['AWS_S3_ENDPOINT'], s3ForcePathStyle: true}
}

process.stdin.resume();

process.stdin.on("data", data => {
  const parsedJSON = JSON.parse(data);
  const source = parsedJSON.source;
  const target = parsedJSON.target;
  pyramid.createPyramidTiff(source, target)
  .catch(err => {
    process.stdout.write(err.message)
  })
  .then(dest => {
    process.stdout.write("complete")
  })
});

process.stdin.on("end", () => {
  process.exit;
});

process.stdin.on("exit", () => {
  process.exit;
});
