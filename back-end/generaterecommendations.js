const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const ddb = new AWS.DynamoDB();
const ddbGeo = require('dynamodb-geo');
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'getaway_locations');
config.hashKeyLength = 5;
const myGeoTableManager = new ddbGeo.GeoDataManager(config);
const axios = require('axios');
const qs = require('qs');

let userPreferences = {};
let beachSeason = ["06", "07", "08"];
let skiSeason = ["12", "01", "02", "03", "04"];
let cities = ["London", "Paris", "New York", "Innsbruck", "Tenerife"];
let cityCode = ["LON", "PAR", "NYC", "INN", "SPC"];
let northernmost = '';
let southernmost = '';
let westernmost = '';
let easternmost = '';
let locations = [];
let increase = true;
let decrease = false;
let rectangle = {};
let countMuseum = 0;
let countArt_gallery = 0;
let countTourist_attraction = 0;
let countBeach = 0;
let countMountain = 0;
let countRestaurant = 0;
let topPicks = [];
let newTopPicks = [];
let holidayBeach = [];
let holidaySki = [];
let batch = [];
let city = [];
let holiday1Weather = [];
let holiday2Weather = [];
let holiday3Weather = [];
let holiday1 = {};
let holiday2 = {};
let holiday3 = {};
let token = '';
let newHotelObj = {};
let newFlightObj = {};
let hotelsHoliday1 = [];
let hotelsHoliday2 = [];
let hotelsHoliday3 = [];
let hotelNights = '';
let flightsHoliday1 = [];
let flightsHoliday2 = [];
let flightsHoliday3 = [];
let userCityCode = '';
let checkRecomm = [];

function calculateDistance(point1, point2) {

    let museum = point2.museum - point1.museum;
    let art_gallery = point2.art_gallery - point1.art_gallery;
    let tourist_attraction = point2.tourist_attraction - point1.tourist_attraction;
    let restaurant = point2.restaurant - point1.restaurant;
    let beach = point2.beach - point1.beach;
    let mountain = point2.mountain - point1.mountain;

    return Math.hypot(museum, art_gallery, tourist_attraction, restaurant, beach, mountain);

}

function formatDate(date) {

    let strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let d = date.getDate();
    let m = strArray[date.getMonth()];
    let y = date.getFullYear();

    return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;

}

exports.handler = async (event) => {

    for (let i = 0; i < event.Records.length; i++) {

        if (event.Records[i].eventName === "INSERT" || event.Records[i].eventName === "MODIFY") {

            userPreferences = {

                user_id: event.Records[i].dynamodb.NewImage.user_id.S,
                museum: event.Records[i].dynamodb.NewImage.museum.S,
                art_gallery: event.Records[i].dynamodb.NewImage.art_gallery.S,
                tourist_attraction: event.Records[i].dynamodb.NewImage.tourist_attraction.S,
                beach: event.Records[i].dynamodb.NewImage.beach.S,
                mountain: event.Records[i].dynamodb.NewImage.mountain.S,
                restaurant: event.Records[i].dynamodb.NewImage.restaurant.S,
                hotel_rating: event.Records[i].dynamodb.NewImage.hotel_rating.S,
                hotel_checkin: event.Records[i].dynamodb.NewImage.hotel_checkin.S,
                hotel_checkout: event.Records[i].dynamodb.NewImage.hotel_checkout.S,
                hotel_budget: event.Records[i].dynamodb.NewImage.hotel_budget.S,
                flight: event.Records[i].dynamodb.NewImage.flight.BOOL,
                flight_budget: event.Records[i].dynamodb.NewImage.flight_budget.S,
                user_location: event.Records[i].dynamodb.NewImage.user_location.S

            };

            console.log(JSON.stringify(userPreferences));

            let paramsUser = {

                TableName: "getaway_recommendations",
                FilterExpression: "user_id = :id",
                ExpressionAttributeValues: {
                    ':id': userPreferences.user_id
                }

            };

            let output = await new Promise((resolve, reject) => {

                documentClient.scan(paramsUser, function (err, data) {

                    if (err) {

                        reject(err);

                    } else {

                        resolve(checkRecomm = data.Items);

                    }

                });

            });

            if (checkRecomm.length != 0) {

                console.log("yes")

                let paramsRecomm = {

                    Key: {

                        'user_id': userPreferences.user_id

                    },
                    TableName: 'getaway_recommendations'
                };

                await new Promise((resolve, reject) => {

                    documentClient.delete(paramsRecomm, function (err, data) {

                        if (err) {

                            reject(console.log("Error", err));

                        } else {

                            resolve(console.log("Success", data));

                        }

                    });


                });

            }

            let checkin = userPreferences.hotel_checkin.split("-");
            let checkout = userPreferences.hotel_checkout.split("-");

            hotelNights = parseInt(checkout[2]) - parseInt(checkin[2]);

            for (let k = 0; k < cities.length; k++) {

                northernmost = '';
                southernmost = '';
                westernmost = '';
                easternmost = '';

                let paramsCities = {

                    TableName: "getaway_locations",
                    FilterExpression: "city = :ci",
                    ExpressionAttributeValues: {
                        ':ci': cities[k]
                    }

                };

                await new Promise((resolve, reject) => {

                    documentClient.scan(paramsCities, function (err, data) {

                        if (err) {

                            reject(err);

                        } else {

                            resolve(locations = data.Items);

                        }

                    });

                });

                for (let x = 0; x < locations.length; x++) {

                    let selectCoor = JSON.parse(locations[x].geoJson);

                    if (locations[x].location_type === "city") {

                        city.push(

                            {

                                name: locations[x].name,
                                address: locations[x].formatted_address,
                                coordinates: JSON.parse(locations[x].geoJson).coordinates,
                                cityCode: cityCode[k]

                            }

                        );

                    }

                    if (northernmost === '') {

                        northernmost = {
                            latitude: selectCoor.coordinates[1],
                            longitude: selectCoor.coordinates[0]
                        };

                        southernmost = {
                            latitude: selectCoor.coordinates[1],
                            longitude: selectCoor.coordinates[0]
                        };

                        westernmost = {
                            latitude: selectCoor.coordinates[1],
                            longitude: selectCoor.coordinates[0]
                        };

                        easternmost = {
                            latitude: selectCoor.coordinates[1],
                            longitude: selectCoor.coordinates[0]
                        };

                    }

                    if (northernmost.latitude < selectCoor.coordinates[1]) {

                        northernmost = {

                            latitude: selectCoor.coordinates[1],
                            longitude: selectCoor.coordinates[0]

                        };

                    }

                    if (southernmost.latitude > selectCoor.coordinates[1]) {

                        southernmost = {

                            latitude: selectCoor.coordinates[1],
                            longitude: selectCoor.coordinates[0]

                        };

                    }

                    if (westernmost.longitude > selectCoor.coordinates[0]) {

                        westernmost = {

                            latitude: selectCoor.coordinates[1],
                            longitude: selectCoor.coordinates[0]

                        };

                    }

                    if (easternmost.longitude < selectCoor.coordinates[0]) {

                        easternmost = {

                            latitude: selectCoor.coordinates[1],
                            longitude: selectCoor.coordinates[0]

                        };

                    }

                }

                let latitude = northernmost.latitude;
                let longitude = northernmost.longitude;

                for (latitude; latitude > southernmost.latitude - 0.1; latitude -= 0.1) {

                    if (increase === true) {

                        rectangle = {

                            maxPointLatitude: latitude + 0.05,
                            maxPointLongitude: longitude + 0.1,

                            minPointLatitude: latitude - 0.1,
                            minPointLongitude: longitude - 0.05

                        };

                        if (latitude < southernmost.latitude) {

                            latitude = northernmost.latitude;
                            longitude += 0.1;

                        }

                        if (longitude > easternmost.longitude) {

                            latitude = northernmost.latitude;
                            longitude = northernmost.longitude;

                            increase = false;
                            decrease = true;

                        }

                        await myGeoTableManager.queryRectangle({

                            MinPoint: {

                                latitude: rectangle.minPointLatitude,
                                longitude: rectangle.minPointLongitude

                            },

                            MaxPoint: {

                                latitude: rectangle.maxPointLatitude,
                                longitude: rectangle.maxPointLongitude

                            }
                        })
                            .then((locations) => {

                                if (locations.length > 10) {

                                    for (let location = 0; location < locations.length; location++) {

                                        if (locations[location].location_type.S === "museum") {

                                            countMuseum += 1;

                                        }

                                        if (locations[location].location_type.S === "art_gallery") {

                                            countArt_gallery += 1;

                                        }

                                        if (locations[location].location_type.S === "tourist_attraction") {

                                            countTourist_attraction += 1;

                                        }

                                        if (locations[location].location_type.S === "beach") {

                                            countBeach += 1;

                                        }

                                        if (locations[location].location_type.S === "mountain") {

                                            countMountain += 1;

                                        }

                                        if (locations[location].location_type.S === "restaurant") {

                                            countRestaurant += 1;


                                        }

                                    }

                                    let resultCount = {

                                        museum: countMuseum,
                                        art_gallery: countArt_gallery,
                                        tourist_attraction: countTourist_attraction,
                                        beach: countBeach,
                                        mountain: countMountain,
                                        restaurant: countRestaurant

                                    };

                                    let distance = calculateDistance(userPreferences, resultCount);

                                    if (countBeach > 0) {

                                        holidayBeach.push(

                                            {

                                                distance: distance,
                                                locations: locations,
                                                city: city[0],
                                                details: {

                                                    type: "beach",
                                                    museums: countMuseum,
                                                    galleries: countArt_gallery,
                                                    attractions: countTourist_attraction,
                                                    restaurants: countRestaurant,
                                                    mountains: countMountain,
                                                    beaches: countBeach

                                                }

                                            }

                                        );

                                    }

                                    if (countMountain > 0) {

                                        holidaySki.push(

                                            {

                                                distance: distance,
                                                locations: locations,
                                                city: city[0],
                                                details: {

                                                    type: "ski",
                                                    museums: countMuseum,
                                                    galleries: countArt_gallery,
                                                    attractions: countTourist_attraction,
                                                    restaurants: countRestaurant,
                                                    mountains: countMountain,
                                                    beaches: countBeach

                                                }

                                            }

                                        );

                                    }

                                    if (countBeach === 0 && countMountain === 0) {

                                        topPicks.push(

                                            {

                                                distance: distance,
                                                locations: locations,
                                                city: city[0],
                                                details: {

                                                    type: "normal",
                                                    museums: countMuseum,
                                                    galleries: countArt_gallery,
                                                    attractions: countTourist_attraction,
                                                    restaurants: countRestaurant,
                                                    mountains: countMountain,
                                                    beaches: countBeach

                                                }

                                            }

                                        );

                                    }

                                    countMuseum = 0;
                                    countArt_gallery = 0;
                                    countTourist_attraction = 0;
                                    countBeach = 0;
                                    countMountain = 0;
                                    countRestaurant = 0;

                                }

                            });

                    }

                    if (decrease === true) {

                        rectangle = {

                            maxPointLatitude: latitude + 0.05,
                            maxPointLongitude: longitude + 0.05,

                            minPointLatitude: latitude - 0.1,
                            minPointLongitude: longitude - 0.1

                        };

                        if (latitude < southernmost.latitude) {

                            latitude = northernmost.latitude;
                            longitude -= 0.1;

                        }

                        if (longitude < westernmost.longitude) {

                            break;

                        }

                        await myGeoTableManager.queryRectangle({

                            MinPoint: {

                                latitude: rectangle.minPointLatitude,
                                longitude: rectangle.minPointLongitude

                            },

                            MaxPoint: {

                                latitude: rectangle.maxPointLatitude,
                                longitude: rectangle.maxPointLongitude

                            }
                        })
                            .then((locations) => {

                                if (locations.length > 10) {

                                    for (let location = 0; location < locations.length; location++) {

                                        if (locations[location].location_type.S === "museum") {

                                            countMuseum += 1;

                                        }

                                        if (locations[location].location_type.S === "art_gallery") {

                                            countArt_gallery += 1;

                                        }

                                        if (locations[location].location_type.S === "tourist_attraction") {

                                            countTourist_attraction += 1;

                                        }

                                        if (locations[location].location_type.S === "beach") {

                                            countBeach += 1;

                                        }

                                        if (locations[location].location_type.S === "mountain") {

                                            countMountain += 1;

                                        }

                                        if (locations[location].location_type.S === "restaurant") {

                                            countRestaurant += 1;

                                        }

                                    }

                                    let resultCount = {

                                        museum: countMuseum,
                                        art_gallery: countArt_gallery,
                                        tourist_attraction: countTourist_attraction,
                                        beach: countBeach,
                                        mountain: countMountain,
                                        restaurant: countRestaurant

                                    };

                                    let distance = calculateDistance(userPreferences, resultCount);

                                    if (countBeach > 0) {

                                        holidayBeach.push(

                                            {

                                                distance: distance,
                                                locations: locations,
                                                city: city[0],
                                                details: {

                                                    type: "beach",
                                                    museums: countMuseum,
                                                    galleries: countArt_gallery,
                                                    attractions: countTourist_attraction,
                                                    restaurants: countRestaurant,
                                                    mountains: countMountain,
                                                    beaches: countBeach

                                                }

                                            }

                                        );

                                    }

                                    if (countMountain > 0) {

                                        holidaySki.push(

                                            {

                                                distance: distance,
                                                locations: locations,
                                                city: city[0],
                                                details: {

                                                    type: "ski",
                                                    museums: countMuseum,
                                                    galleries: countArt_gallery,
                                                    attractions: countTourist_attraction,
                                                    restaurants: countRestaurant,
                                                    mountains: countMountain,
                                                    beaches: countBeach

                                                }

                                            }

                                        );

                                    }

                                    if (countBeach === 0 && countMountain === 0) {

                                        topPicks.push(

                                            {

                                                distance: distance,
                                                locations: locations,
                                                city: city[0],
                                                details: {

                                                    type: "normal",
                                                    museums: countMuseum,
                                                    galleries: countArt_gallery,
                                                    attractions: countTourist_attraction,
                                                    restaurants: countRestaurant,
                                                    mountains: countMountain,
                                                    beaches: countBeach

                                                }

                                            }

                                        );

                                    }

                                    countMuseum = 0;
                                    countArt_gallery = 0;
                                    countTourist_attraction = 0;
                                    countBeach = 0;
                                    countMountain = 0;
                                    countRestaurant = 0;

                                }

                            });

                    }

                }

                topPicks.sort((a, b) => a.distance - b.distance);


                newTopPicks.push(topPicks[0]);

                topPicks = [];

                city = [];

            }

            let bits = userPreferences.hotel_checkin.split("-");

            if (holidayBeach.length > 0) {

                for (let b = 0; b < beachSeason.length; b++) {

                    if (bits[1].includes(beachSeason[b])) {

                        holidayBeach.sort((a, b) => a.distance - b.distance);

                        newTopPicks[2] = holidayBeach[0];

                    }

                }

            }

            if (holidaySki.length > 0) {

                for (let s = 0; s < skiSeason.length; s++) {

                    if (bits[1].includes(skiSeason[s])) {

                        holidaySki.sort((a, b) => a.distance - b.distance);

                        newTopPicks[2] = holidaySki[0];

                    }

                }

            }

            let recommendations = newTopPicks.slice(0, 3);

            for (let j = 0; j < recommendations.length; j++) {

                let day = new Date();

                let latitude = recommendations[j].city.coordinates[1];
                let longitude = recommendations[j].city.coordinates[0];

                await axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=eeecbaef7d8ebfceb80862aeda7561ee')
                    .then(response => {

                        for (let i = 0; i < response.data.daily.length; i++) {

                            let newObject = {

                                icon: "http://openweathermap.org/img/wn/" + response.data.daily[i].weather[0].icon + "@2x.png",
                                day: response.data.daily[i].feels_like.day,
                                night: response.data.daily[i].feels_like.night,
                                description: response.data.daily[i].weather[0].description,
                                date: formatDate(new Date(day.getFullYear(), day.getMonth(), day.getDate() + i))

                            };

                            if (j === 0) {

                                holiday1Weather.push(newObject);

                            }

                            if (j === 1) {

                                holiday2Weather.push(newObject);

                            }

                            if (j === 2) {

                                holiday3Weather.push(newObject);

                            }

                        }
                    })
                    .catch(error => {

                        console.log(error);

                    });

            }

            await axios({
                method: 'post',
                url: 'https://test.api.amadeus.com/v1/security/oauth2/token',
                data: qs.stringify({
                    client_id: 'AjtrDKpOMs1ZuUFboQGAmf98KyRPRwFu',
                    client_secret: 'VgGjDYG6IJUoGp2z',
                    grant_type: 'client_credentials'
                }),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })
                .then(function (response) {
                    token = response.data.access_token;
                })
                .catch(function (error) {
                    console.log(error);
                });

            for (let k = 0; k < recommendations.length; k++) {

                await axios.get('https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=' + recommendations[k].city.cityCode,
                    {
                        headers: {

                            'Authorization': `Bearer ${token}`

                        }
                    }
                )
                    .then(function (response) {

                        if (response.data.data.length != 0) {

                            let price = '';

                            for (let i = 0; i < response.data.data.length; i++) {

                                if (response.data.data[i].hotel.rating === userPreferences.hotel_rating) {

                                    for (let j = 0; j < response.data.data[i].offers.length; j++) {

                                        price = response.data.data[i].offers[j].price.total;

                                        if (parseInt(userPreferences.hotel_budget) > parseInt(response.data.data[i].offers[j].price.total)) {

                                            newHotelObj = {

                                                name: response.data.data[i].hotel.name,
                                                coordinates: [response.data.data[i].hotel.latitude, response.data.data[i].hotel.longitude],
                                                address: response.data.data[i].hotel.address.lines,
                                                price: parseInt(price) * hotelNights,
                                                website: "https://www.booking.com/"

                                            };

                                            if (k === 0) {

                                                if (hotelsHoliday1.length < 5) {

                                                    hotelsHoliday1.push(newHotelObj);

                                                }

                                            }

                                            if (k === 1) {

                                                if (hotelsHoliday2.length < 5) {

                                                    hotelsHoliday2.push(newHotelObj);

                                                }

                                            }

                                            if (k === 2) {

                                                if (hotelsHoliday3.length < 5) {

                                                    hotelsHoliday3.push(newHotelObj);

                                                }

                                            }

                                        }

                                    }

                                } else {

                                    for (let j = 0; j < response.data.data[i].offers.length; j++) {

                                        price = response.data.data[i].offers[j].price.total;

                                        newHotelObj = {

                                            name: response.data.data[i].hotel.name,
                                            coordinates: [response.data.data[i].hotel.latitude, response.data.data[i].hotel.longitude],
                                            address: response.data.data[i].hotel.address.lines,
                                            price: parseInt(price) * hotelNights,
                                            website: "https://www.booking.com/"

                                        };

                                        if (k === 0) {

                                            if (hotelsHoliday1.length < 5) {

                                                hotelsHoliday1.push(newHotelObj);

                                            }

                                        }

                                        if (k === 1) {

                                            if (hotelsHoliday2.length < 5) {

                                                hotelsHoliday2.push(newHotelObj);

                                            }

                                        }

                                        if (k === 2) {

                                            if (hotelsHoliday3.length < 5) {

                                                hotelsHoliday3.push(newHotelObj);

                                            }

                                        }

                                    }

                                }

                            }
                        }

                    })
                    .catch(function (error) {

                    });

            }

            await axios.get('https://test.api.amadeus.com/v1/reference-data/locations',
                {
                    headers: {

                        'Authorization': `Bearer ${token}`

                    },

                    params: {

                        subType: "CITY",
                        keyword: userPreferences.user_location

                    }
                }
            )
                .then(function (response) {

                    if (response.data.data.length != 0) {

                        userCityCode = response.data.data[0].address.cityCode;

                    }

                })
                .catch(function (error) {
                    console.log(error);
                });


            if (userPreferences.flight === true) {

                for (let k = 0; k < recommendations.length; k++) {

                    if (userCityCode != recommendations[k].city.cityCode) {

                        await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers',
                            {
                                headers: {

                                    'Authorization': `Bearer ${token}`

                                },

                                params: {

                                    originLocationCode: userCityCode,
                                    destinationLocationCode: recommendations[k].city.cityCode,
                                    departureDate: userPreferences.hotel_checkin,
                                    returnDate: userPreferences.hotel_checkout,
                                    adults: "1",
                                    max: 1

                                }
                            }
                        )
                            .then(function (response) {

                                if (response.data.data.length != 0) {

                                    for (let f = 0; f < response.data.data.length; f++) {

                                        for (let g = 0; g < response.data.data[f].itineraries.length; g++) {

                                            if (parseInt(userPreferences.flight_budget) > parseInt(response.data.data[f].price.grandTotal)) {

                                                if (response.data.data[f].itineraries[g].segments.length === 1) {

                                                    let timeArrival = response.data.data[f].itineraries[g].segments[0].arrival.at.split("T");
                                                    let timeDeparture = response.data.data[f].itineraries[g].segments[0].departure.at.split("T");

                                                    newFlightObj = {

                                                        interchange: 1,
                                                        departure: {
                                                            time: timeDeparture[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[0].carrierCode
                                                        },
                                                        arrival: {
                                                            time: timeArrival[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].arrival.iataCode
                                                        },
                                                        price: response.data.data[f].price.grandTotal,
                                                        website: "https://www.skyscanner.net/"

                                                    };

                                                }

                                                if (response.data.data[f].itineraries[g].segments.length === 2) {

                                                    let timeArrival1 = response.data.data[f].itineraries[g].segments[0].arrival.at.split("T");
                                                    let timeDeparture1 = response.data.data[f].itineraries[g].segments[0].departure.at.split("T");
                                                    let timeArrival2 = response.data.data[f].itineraries[g].segments[1].arrival.at.split("T");
                                                    let timeDeparture2 = response.data.data[f].itineraries[g].segments[1].departure.at.split("T");

                                                    newFlightObj = {

                                                        interchange: 2,
                                                        departure1: {
                                                            time: timeDeparture1[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[0].carrierCode
                                                        },
                                                        arrival1: {
                                                            time: timeArrival1[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].arrival.iataCode,
                                                        },
                                                        departure2: {
                                                            time: timeArrival2[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[1].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[1].carrierCode
                                                        },
                                                        arrival2: {
                                                            time: timeDeparture2[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[1].arrival.iataCode,
                                                        },
                                                        price: response.data.data[f].price.grandTotal,
                                                        website: "https://www.skyscanner.net/"

                                                    };

                                                }

                                                if (response.data.data[f].itineraries[g].segments.length === 3) {

                                                    let timeArrival1 = response.data.data[f].itineraries[g].segments[0].arrival.at.split("T");
                                                    let timeDeparture1 = response.data.data[f].itineraries[g].segments[0].departure.at.split("T");
                                                    let timeArrival2 = response.data.data[f].itineraries[g].segments[1].arrival.at.split("T");
                                                    let timeDeparture2 = response.data.data[f].itineraries[g].segments[1].departure.at.split("T");
                                                    let timeArrival3 = response.data.data[f].itineraries[g].segments[2].arrival.at.split("T");
                                                    let timeDeparture3 = response.data.data[f].itineraries[g].segments[2].departure.at.split("T");

                                                    newFlightObj = {

                                                        interchange: 3,
                                                        departure1: {
                                                            time: timeDeparture1[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[0].carrierCode
                                                        },
                                                        arrival1: {
                                                            time: timeArrival1[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].arrival.iataCode,
                                                        },
                                                        departure2: {
                                                            time: timeDeparture2[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[1].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[1].carrierCode
                                                        },
                                                        arrival2: {
                                                            time: timeArrival2[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[1].arrival.iataCode
                                                        },
                                                        departure3: {
                                                            time: timeDeparture3[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[2].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[2].carrierCode
                                                        },
                                                        arrival3: {
                                                            time: timeArrival3[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[2].arrival.iataCode
                                                        },
                                                        price: response.data.data[f].price.grandTotal,
                                                        website: "https://www.skyscanner.net/"

                                                    };

                                                }

                                                if (k === 0) {

                                                    flightsHoliday1.push(newFlightObj);

                                                }


                                                if (k === 1) {

                                                    flightsHoliday2.push(newFlightObj);

                                                }

                                                if (k === 2) {

                                                    flightsHoliday3.push(newFlightObj);

                                                }

                                            } else {

                                                if (response.data.data[f].itineraries[g].segments.length === 1) {

                                                    let timeArrival = response.data.data[f].itineraries[g].segments[0].arrival.at.split("T");
                                                    let timeDeparture = response.data.data[f].itineraries[g].segments[0].departure.at.split("T");

                                                    newFlightObj = {

                                                        interchange: 1,
                                                        departure: {
                                                            time: timeDeparture[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[0].carrierCode
                                                        },
                                                        arrival: {
                                                            time: timeArrival[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].arrival.iataCode
                                                        },
                                                        price: response.data.data[f].price.grandTotal,
                                                        website: "https://www.skyscanner.net/"

                                                    };

                                                }

                                                if (response.data.data[f].itineraries[g].segments.length === 2) {

                                                    let timeArrival1 = response.data.data[f].itineraries[g].segments[0].arrival.at.split("T");
                                                    let timeDeparture1 = response.data.data[f].itineraries[g].segments[0].departure.at.split("T");
                                                    let timeArrival2 = response.data.data[f].itineraries[g].segments[1].arrival.at.split("T");
                                                    let timeDeparture2 = response.data.data[f].itineraries[g].segments[1].departure.at.split("T");

                                                    newFlightObj = {

                                                        interchange: 2,
                                                        departure1: {
                                                            time: timeDeparture1[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[0].carrierCode
                                                        },
                                                        arrival1: {
                                                            time: timeArrival1[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].arrival.iataCode,
                                                        },
                                                        departure2: {
                                                            time: timeArrival2[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[1].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[1].carrierCode
                                                        },
                                                        arrival2: {
                                                            time: timeDeparture2[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[1].arrival.iataCode,
                                                        },
                                                        price: response.data.data[f].price.grandTotal,
                                                        website: "https://www.skyscanner.net/"

                                                    };

                                                }

                                                if (response.data.data[f].itineraries[g].segments.length === 3) {

                                                    let timeArrival1 = response.data.data[f].itineraries[g].segments[0].arrival.at.split("T");
                                                    let timeDeparture1 = response.data.data[f].itineraries[g].segments[0].departure.at.split("T");
                                                    let timeArrival2 = response.data.data[f].itineraries[g].segments[1].arrival.at.split("T");
                                                    let timeDeparture2 = response.data.data[f].itineraries[g].segments[1].departure.at.split("T");
                                                    let timeArrival3 = response.data.data[f].itineraries[g].segments[2].arrival.at.split("T");
                                                    let timeDeparture3 = response.data.data[f].itineraries[g].segments[2].departure.at.split("T");

                                                    newFlightObj = {

                                                        interchange: 3,
                                                        departure1: {
                                                            time: timeDeparture1[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[0].carrierCode
                                                        },
                                                        arrival1: {
                                                            time: timeArrival1[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[0].arrival.iataCode,
                                                        },
                                                        departure2: {
                                                            time: timeDeparture2[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[1].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[1].carrierCode
                                                        },
                                                        arrival2: {
                                                            time: timeArrival2[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[1].arrival.iataCode
                                                        },
                                                        departure3: {
                                                            time: timeDeparture3[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[2].departure.iataCode,
                                                            carrierCode: response.data.data[f].itineraries[g].segments[2].carrierCode
                                                        },
                                                        arrival3: {
                                                            time: timeArrival3[1],
                                                            iataCode: response.data.data[f].itineraries[g].segments[2].arrival.iataCode
                                                        },
                                                        price: response.data.data[f].price.grandTotal,
                                                        website: "https://www.skyscanner.net/"

                                                    };

                                                }

                                                if (k === 0) {

                                                    flightsHoliday1.push(newFlightObj);

                                                }


                                                if (k === 1) {

                                                    flightsHoliday2.push(newFlightObj);

                                                }

                                                if (k === 2) {

                                                    flightsHoliday3.push(newFlightObj);

                                                }

                                            }

                                        }

                                    }

                                } else {

                                    if (k === 0) {

                                        flightsHoliday1.push({ interchange: 0 }, { interchange: 0 });

                                    }

                                    if (k === 1) {

                                        flightsHoliday2.push({ interchange: 0 }, { interchange: 0 });

                                    }

                                    if (k === 2) {

                                        flightsHoliday3.push({ interchange: 0 }, { interchange: 0 });

                                    }

                                }

                            })
                            .catch(function (error) {
                                console.log(error);
                            });

                    } else {

                        if (k === 0) {

                            flightsHoliday1.push({ interchange: 0 }, { interchange: 0 });

                        }

                        if (k === 1) {

                            flightsHoliday2.push({ interchange: 0 }, { interchange: 0 });

                        }

                        if (k === 2) {

                            flightsHoliday3.push({ interchange: 0 }, { interchange: 0 });

                        }

                    }

                }

            }

            holiday1 = {

                recommendation: recommendations[0].locations,
                city: recommendations[0].city,
                weather: holiday1Weather,
                hotel: hotelsHoliday1,
                flight: flightsHoliday1,
                checkin: userPreferences.hotel_checkin,
                checkout: userPreferences.hotel_checkout,
                nights: hotelNights,
                details: recommendations[0].details

            };

            holiday2 = {

                recommendation: recommendations[1].locations,
                city: recommendations[1].city,
                weather: holiday2Weather,
                hotel: hotelsHoliday2,
                flight: flightsHoliday2,
                checkin: userPreferences.hotel_checkin,
                checkout: userPreferences.hotel_checkout,
                nights: hotelNights,
                details: recommendations[1].details


            };

            holiday3 = {

                recommendation: recommendations[2].locations,
                city: recommendations[2].city,
                weather: holiday3Weather,
                hotel: hotelsHoliday3,
                flight: flightsHoliday3,
                checkin: userPreferences.hotel_checkin,
                checkout: userPreferences.hotel_checkout,
                nights: hotelNights,
                details: recommendations[2].details


            };

            let newParams = {

                PutRequest: {

                    Item: {

                        "user_id": { "S": userPreferences.user_id },
                        "holiday1": { "S": JSON.stringify(holiday1) },
                        "holiday2": { "S": JSON.stringify(holiday2) },
                        "holiday3": { "S": JSON.stringify(holiday3) },

                    }

                }

            };

            batch.push(newParams);

            let params = {

                RequestItems: {

                    "getaway_recommendations": batch

                }

            };

            await new Promise((resolve, reject) => {

                ddb.batchWriteItem(params, function (error, data) {

                    if (error) {

                        reject(console.log(error));

                    } else {

                        resolve(console.log(data));

                    }

                });

            });

        }

    }

};