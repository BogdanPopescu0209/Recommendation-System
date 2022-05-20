const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    const params = {

        TableName: "getaway_preferences",
        Key: {
            "user_id": event.user_id,
        },
        UpdateExpression: "SET museum = :museum, art_gallery = :art_gallery, tourist_attraction = :tourist_attraction, beach = :beach, mountain = :mountain , restaurant = :restaurant, hotel_rating = :hotel_rating, hotel_checkin = :hotel_checkin, hotel_checkout = :hotel_checkout, hotel_budget = :hotel_budget, flight = :flight, flight_budget = :flight_budget, user_location = :user_location",
        ExpressionAttributeValues: {

            ":museum": event.museum,
            ":art_gallery": event.art_gallery,
            ":tourist_attraction": event.tourist_attraction,
            ":beach": event.beach,
            ":mountain": event.mountain,
            ":restaurant": event.restaurant,
            ":hotel_rating": event.hotel_rating,
            ":hotel_checkin": event.hotel_checkin,
            ":hotel_checkout": event.hotel_checkout,
            ":hotel_budget": event.hotel_budget,
            ":flight": event.flight,
            ":flight_budget": event.flight_budget,
            ":user_location": event.user_location

        }

    };

    const putPreferences = await new Promise((resolve, reject) => {

        docClient.update(params, function (error, data) {

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
        body: putPreferences,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }

    };

};