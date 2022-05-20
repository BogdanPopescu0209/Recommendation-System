const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    const params = {

        TableName: "getaway_recommendations",
        Key: {
            "user_id": event.queryStringParameters.user_id,
        }

    };

    const getRecommendations = await new Promise((resolve, reject) => {

        docClient.get(params, function (error, data) {

            if (error) {

                reject(console.log(error));

            } else {

                resolve(data);

            }

        });

    });

    return {

        statusCode: 200,
        body: JSON.stringify(getRecommendations),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }

    };

};