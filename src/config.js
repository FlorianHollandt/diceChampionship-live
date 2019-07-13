// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

require('dotenv').config();

module.exports = {
    logging: {
        request: true,
        requestObjects: [
          'request'
        ],
        response: true,
        responseObjects: [
          'response.outputSpeech.ssml'
        ],
    },
    intentMap: {
       'AMAZON.StopIntent': 'END',
       'AMAZON.CancelIntent': 'END',
       'AMAZON.NoIntent': 'END',
       'AMAZON.YesIntent': 'YesIntent',
       'AMAZON.HelpIntent': 'HelpIntent',
    },
    db: {
        DynamoDb: {
            tableName: process.env.DYNAMODB_TABLE_NAME_USERS,
            awsConfig: {
                accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
                secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY, 
                region:  process.env.DYNAMODB_REGION,
            },
        },
    },
    custom: {
        DynamoDb: {
            tableName: process.env.DYNAMODB_TABLE_NAME_SCORES,
            keyAttributeName: 'id',
            keyAttributeType: 'S',
            scoreAttributeName: 'score',
            scoreAttributeType: 'N',
        },
        game: {
            numberOfDice: 10,
            sidesPerDice: 6,
        },
    },
 };
 