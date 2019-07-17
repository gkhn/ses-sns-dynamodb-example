module.exports = function(recipient, message, logMessage) {
    const AWS = require("aws-sdk");
    const sns = new AWS.SNS();
    const messageType = "sms";
    sns.publish(
        {
            Message: message,
            PhoneNumber: recipient
        },
        function(err, data) {
            if (err) {
                console.log(err.stack);
                logMessage(recipient, message, messageType, "fail");
                return false;
            } else {
                console.log(data);
                logMessage(recipient, message, messageType, "success");
                return true;
            }
        }
    );
};
