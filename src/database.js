
const config = require('./config');

const isLambda = require('is-lambda');
const AWS = require('aws-sdk');

if (!isLambda) {
    AWS.config.update(
        {
            region: config.db.DynamoDb.awsConfig.region,
            accessKeyId: config.db.DynamoDb.awsConfig.accessKeyId,
            secretAccessKey: config.db.DynamoDb.awsConfig.secretAccessKey,
        }
    );
}

module.exports = {

    submitScore: function(playerId, score, rounds, platform, locale, userStatus='default') {
        return new Promise(async (resolve, reject) => {
            try {
                const docClient = new AWS.DynamoDB.DocumentClient();
                const parameters = {
                    Item: {
                    id: playerId,
                    score: score,
                    rounds: rounds,
                    rounds: rounds,
                    platform: platform,
                    locale: locale,
                    userStatus: userStatus,
                    version: config.custom.version,
                    }, 
                    // ReturnConsumedCapacity: "TOTAL", 
                    TableName : config.custom.DynamoDb.tableName,
                };
                console.log(`Putting item now...`);
                docClient.put(
                    parameters,
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            } catch (e) {
                console.log(`Error: ${JSON.stringify(e, null, 4)}`);
                reject(e);
            }
        });
    },

    getRank: function(playerId, score) {
        return new Promise(async (resolve, reject) => {
            try {
                const docClient = new AWS.DynamoDB.DocumentClient();
                const parameters = {
                    TableName : config.custom.DynamoDb.tableName,
                    Select: 'COUNT',
                    // ProjectionExpression : 'id',
                    FilterExpression : "score >= :score_value AND id <> :player_id",
                    ExpressionAttributeValues:{
                        ":score_value" : score, 
                        ":player_id" : playerId, 
                    },
                };
                docClient.scan(
                    parameters,
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results.Count + 1);
                    }
                );
            } catch (e) {
                reject(e);
            }
        });
    },
};

