module.exports = function(recipient, message, messageType, deliveryStatus) {
    const AWS = require("aws-sdk");
    const db = new AWS.DynamoDB();
    const tableName = process.env.DDB_TABLE_NAME;
    const datetime = new Date().getTime().toString();

    db.putItem(
        {
            TableName: tableName,
            Item: {
                recipient: {
                    S: recipient
                },
                message: {
                    S: message
                },
                messageType: {
                    S: messageType
                },
                deliveryStatus: {
                    S: deliveryStatus
                },
                timedate: {
                    N: datetime
                }
            }
        },
        function(err, data) {
            if (err) {
                console.log(err.stack);
                return false;
            } else {
                console.log(data);
                return true;
            }
        }
    );
};
