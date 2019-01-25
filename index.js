const pyramid = require('./lib/pyramid');

exports.lambdaHandler = (event, context, callback) => {
  var awsRegion = context.invokedFunctionArn.split(/:/)[3];
  AWS.config.update({region: awsRegion});

  pyramid.createPyramidTiff(event.src, event.dest)
    .catch(err => callback(err, event))
    .then(_dest => callback(null, event));
};

