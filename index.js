const Consumer = require('sqs-consumer');
const pyramid  = require('./pyramid');

if (process.env['ECS_CONTAINER_METADATA_FILE']) {
  var instanceMetadata = require(process.env['ECS_CONTAINER_METADATA_FILE']);
  var awsRegion = instanceMetadata.ContainerInstanceARN.split(/:/)[3];
  AWS.config.update({region: awsRegion});
}

const queueUrl = process.env.queueUrl;

console.log(`Processing messages from ${queueUrl}`);
const app = Consumer.create({
  queueUrl: queueUrl,
  waitTimeSeconds: process.env.waitTimeSeconds || 5,
  handleMessage: async (message) => {
    var params = JSON.parse(message.Body);
    console.log(`createPyramidTiff: [begin] ${params.source} -> ${params.target}`);
    await pyramid.createPyramidTiff(params.source, params.target)
      .catch(err => console.log(`createPyramidTiff: [error] ${params.source} -> ${params.target}: ${err.message}`))
      .then(dest => console.log(`createPyramidTiff: [end] ${params.source} -> ${params.target}`))
  }
})

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.on('empty', () => {
  console.log('Queue empty. Exiting.')
  app.stop();
});

app.start();