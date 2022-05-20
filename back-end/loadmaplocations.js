const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const ddb = new AWS.DynamoDB()
const ddbGeo = require('dynamodb-geo')
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'getaway_locations')
config.hashKeyLength = 5
const myGeoTableManager = new ddbGeo.GeoDataManager(config)
const uuid = require('uuid')
const axios = require("axios");

const setupTable = () => {


    const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config)

    createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5

    console.log('Creating table with schema:')
    console.dir(createTableInput, { depth: null })

    ddb.createTable(createTableInput).promise()

        .then(function () {

            return ddb.waitFor('tableExists', { TableName: config.tableName }).promise()

        })
        .then(function () {

            console.log('Table created and ready!')

        })
}

const loadTable = () => {

    const dataTypes = ['museum', 'art_gallery', 'tourist_attraction', 'beach', 'mountain', 'restaurant', 'city'];

    for (let i = 0; i < dataTypes.length; i++) {

        axios
            .get('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + dataTypes[i] + '%20in%20London&key=AIzaSyCaeWrBuRjN36zXpYNQ608I3eG8QTil9Z4')
            .then(res => {

                const putPointInputs = res.data.results.map(function (location) {
                    return {
                        RangeKeyValue: { S: uuid.v4() },
                        GeoPoint: {
                            latitude: location.geometry.location.lat,
                            longitude: location.geometry.location.lng
                        },
                        PutItemInput: {
                            Item: {
                                name: { S: location.name },
                                formatted_address: { S: location.formatted_address },
                                location_type: { S: dataTypes[i] },
                                city: { S: 'Tenerife' }
                            },
                        }
                    }
                })

                const BATCH_SIZE = 25
                const WAIT_BETWEEN_BATCHES_MS = 1000
                let currentBatch = 1

                function resumeWriting() {
                    if (putPointInputs.length === 0) {

                        return Promise.resolve()

                    }

                    const thisBatch = []

                    for (let i = 0, itemToAdd = null; i < BATCH_SIZE && (itemToAdd = putPointInputs.shift()); i++) {

                        thisBatch.push(itemToAdd)

                    }

                    console.log('Writing batch ' + (currentBatch++) + '/' + Math.ceil(res.data.results.length / BATCH_SIZE))

                    return myGeoTableManager.batchWritePoints(thisBatch).promise()
                        .then(function () {

                            return new Promise(function (resolve) {

                                setInterval(resolve, WAIT_BETWEEN_BATCHES_MS)

                            })

                        })
                        .then(function () {

                            return resumeWriting()

                        })

                }

                return resumeWriting().catch(function (error) {

                    console.warn(error)

                })

            })
            .catch(err => console.error(err))
    }

    console.log('Data loaded!');
}

loadTable()

setupTable();


