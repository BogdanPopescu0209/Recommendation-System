const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(event)
    const params = {

        TableName: "getaway_preferences",
        Key: {

            "user_id": event.queryStringParameters.user_id

        }

    };

    const getPreferences = await new Promise((resolve, reject) => {

        docClient.get(params, function (error, data) {

            if (error) {

                reject(console.log(error));

            } else {

                resolve(data);

            }

        });

    });

    console.log(getPreferences)

    return {

        statusCode: 200,
        body: JSON.stringify(getPreferences),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Authorization"
        }

    };

};

