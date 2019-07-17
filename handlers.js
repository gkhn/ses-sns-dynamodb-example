const sendEmail = require("lib/sendEmail");
const sendSms = require("lib/sendSms");
const logMessage = require("lib/logMessage");

module.exports.getMessages = (event, context, callback) => {
  if (
    event["queryStringParameters"] === undefined ||
    event["queryStringParameters"] === null ||
    !event["queryStringParameters"]["recipient"]
  ) {
    const response = {
      statusCode: 200,
      body: JSON.stringify([])
    };
    callback(null, response);
    return;
  }
  const recipient = event["queryStringParameters"]["recipient"];
  const AWS = require("aws-sdk");
  const docClient = new AWS.DynamoDB.DocumentClient();
  const tableName = process.env.DDB_TABLE_NAME;
  const params = {
    KeyConditionExpression: "recipient = :rcpt",
    ExpressionAttributeValues: {
      ":rcpt": recipient
    },
    TableName: tableName
  };
  docClient.query(params, function(err, data) {
    const response = {
      statusCode: 200
    };
    if (err) {
      console.log(err, err.stack);
      response.body = [];
    } else {
      console.log(data);
      response.body = JSON.stringify(data.Items);
    }
    callback(null, response);
  });
};

module.exports.queueMessage = (event, context, callback) => {
  var AWS = require("aws-sdk");
  var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

  var params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: process.env.SQS_URL
  };
  let statusCode = 200;
  let resultMessage = "Message added to serverless queue";
  let res = sqs.sendMessage(params, function(err, data) {
    if (err) {
      statusCode = 500;
      resultMessage = "Error: " + err;
    }
  });

  const response = {
    statusCode: statusCode,
    body: JSON.stringify(resultMessage)
  };
  callback(null, response);
};

module.exports.sendMessage = (event, context, callback) => {
  const body = JSON.parse(JSON.parse(event.Records[0].body).body);
  const recipient = body.recipient;
  const message = body.message;

  if (recipient.indexOf("@") != -1) {
    sendEmail(recipient, message, logMessage);
  } else {
    sendSms(recipient, message, logMessage);
  }
};
