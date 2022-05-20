const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    const newPreferences = {

        "user_id": event.user_id,
        "museum": event.museum,
        "art_gallery": event.art_gallery,
        "tourist_attraction": event.tourist_attraction,
        "beach": event.beach,
        "mountain": event.mountain,
        "restaurant": event.restaurant,
        "hotel_rating": event.hotel_rating,
        "hotel_checkin": event.hotel_checkin,
        "hotel_checkout": event.hotel_checkout,
        "hotel_budget": event.hotel_budget,
        "flight": event.flight,
        "flight_budget": event.flight_budget,
        "user_location": event.user_location

    };

    const params = {

        TableName: 'getaway_preferences',
        Item: newPreferences

    };

    const postPreferences = await new Promise((resolve, reject) => {

        docClient.put(params, function (error, data) {

            if (error) {

                reject(console.log(error));

            }

            else {

                resolve({ ok: true, data });

            }

        });

    });

    return {

        statusCode: 200,
        body: postPreferences,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }

    };

};
