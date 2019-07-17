module.exports = function(recipient, message, logMessage) {
  const AWS = require("aws-sdk");
  const ses = new AWS.SES();
  const messageType = "email";
  const params = {
    Destination: {
      ToAddresses: [recipient]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message
        },
        Text: {
          Charset: "UTF-8",
          Data: message
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "E-mail from API"
      }
    },
    ReturnPath: recipient,
    Source: recipient
  };
  ses.sendEmail(params, function(err, data) {
    if (err) {
      console.log(err.stack);
      logMessage(recipient, message, messageType, "fail");
      return false;
    } else {
      console.log(data);
      logMessage(recipient, message, messageType, "success");
      return true;
    }
  });
};
