const express = require(`express`);
const app = express();
const nunjucks = require(`nunjucks`);
const bodyParser = require(`body-parser`);
const mongoDB = require(`mongodb`);
const mongoClient = mongoDB.MongoClient;
const dbURL = `mongodb://localhost:27017`;
const dbName = ``;
const dbCollection = ``;
const PORT = 3000;

let db;

nunjucks.configure(`views`, {
    express: app,
    autoescape: true
});
