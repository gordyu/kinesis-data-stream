const faker = require('faker');
const moment = require('moment');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const kinesis = new AWS.Kinesis();

setInterval( async () => {
    try {
        let data = await generateNotesItem();
        let params = {
            Data: new Buffer(JSON.stringify(data)),
            PartitionKey: 'P1',
            StreamName: 'ServerlessNotesStream'
        };
        let response = await kinesis.putRecord(params).promise();
        console.log("Data:", data);
        console.log("Response:", response);
        console.log(); //adds blank line to seperate different items in terminal
    } catch(err) {
        throw err;
    }
}, 1000);

generateNotesItem = async () => {
    return ({
        user_id: faker.random.uuid(),
        timestamp: moment().unix(),
        cat: faker.random.word(),
        title: faker.company.catchPhrase(),
        content: faker.hacker.phrase(),
        note_id: faker.random.uuid(),
        user_name: faker.internet.userName(),
        expires: moment.unix() + 600
    });
}