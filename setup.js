
const config = require('./src/config');

const AWS = require('aws-sdk');
AWS.config.update(
    {
        region: config.db.DynamoDb.awsConfig.region,
        accessKeyId: config.db.DynamoDb.awsConfig.accessKeyId,
        secretAccessKey: config.db.DynamoDb.awsConfig.secretAccessKey,
    }
);
const dynamodb = new AWS.DynamoDB();

main();

async function main() {
    console.time('Retrieving list of tables: ');
    let tableList;
    try {
        tableList = await listTables();
    } catch (error) {
        console.error(`Error at retrieving list of tables: ${JSON.stringify(error, null, 4)}`);
    }
    console.timeEnd('Retrieving list of tables: ');
    console.log(`Table list: ${tableList.join(', ')}`);

    if (tableList.indexOf(config.custom.DynamoDb.tableName) < 0) {
        console.time('Setting up score table: ');
        try {
            const tableSetupResult = await createScoreTable();
            console.log(`Table setup result: ${JSON.stringify(tableSetupResult, null, 4)}`);
        } catch (error) {
            console.error(`Error at setting up score table: ${JSON.stringify(error, null, 4)}`);
        }
        console.timeEnd('Setting up score table: ');
    } else {
        console.log(`Score table (${
            config.custom.dbTables.scores.tableName
        }) already set up. :)`);
    }

    return;
}

function listTables() {
    return new Promise(async (resolve, reject) => {
        try {
            const parameters = {};
            const query = dynamodb.listTables(
                parameters,
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results.TableNames);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}

function createScoreTable() {
    return new Promise(async (resolve, reject) => {
        try {
            const parameters = {
                AttributeDefinitions: [
                    {
                        AttributeName: config.custom.DynamoDb.keyAttributeName,
                        AttributeType: config.custom.DynamoDb.keyAttributeType,
                    },
                ],
                KeySchema: [
                    {
                        AttributeName: config.custom.DynamoDb.keyAttributeName,
                        KeyType: 'HASH',
                    },
                ],
                TableName: config.custom.DynamoDb.tableName,
                BillingMode: 'PROVISIONED', // Default b/c it qualifies for the DynamoDB free tier, otherwise 'PAY_PER_REQUEST'
                ProvisionedThroughput: {    // Only if 'BillingMode' is 'PROVISIONED'
                    ReadCapacityUnits: '1',
                    WriteCapacityUnits: '1',
                },
              };
            const query = dynamodb.createTable(
                parameters,
                (error, results) => {
                    console.log(`Error: ${JSON.stringify(error, null, 4)}`);
                    console.log(`Results: ${JSON.stringify(results, null, 4)}`);
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}
