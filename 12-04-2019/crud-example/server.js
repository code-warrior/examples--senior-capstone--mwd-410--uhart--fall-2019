const express = require(`express`);
const app = express();
const nunjucks = require(`nunjucks`);
const bodyParser = require(`body-parser`);
const mongoDB = require(`mongodb`);
const mongoClient = mongoDB.MongoClient;
const dbURL = `mongodb://localhost:27017`;
const dbName = `project`;
const dbCollection = `users`;
const PORT = 3000;

let db;
let port;

mongoClient.connect(dbURL, {useUnifiedTopology: true}, (err, client) => {
    if (err) {
        return console.log(err);
    }

    db = client.db(dbName);
    port = (process.env.PORT || PORT);

    app.listen(port, () => {
        console.log(
            `Connection to Mongo successful. Visit http://localhost:${port}\n`
        );
    });
});

nunjucks.configure(`views`, {
    express: app,
    autoescape: true
});

// Express’ way of setting a variable. In this case, “view engine” to “njk”.
app.set(`view engine`, `njk`);

// Express middleware to parse incoming, form-based request data before processing
// form data.
app.use(bodyParser.urlencoded({extended: true}));

// Express middleware to parse incoming request bodies before handlers.
app.use(bodyParser.json());

// Express middleware to server HTML, CSS, and JS files.
app.use(express.static(`public`));

/**
 * All req(uests) are from the client/browser.
 * All res(ponses) are to the client/browser.
 */

/**
 * This router handles all GET requests to the root of the web site.
 */
app.get(`/`, (req, res) => {
    console.log(`User requested root of web site.`);
    console.log(`Responding to request by submitting index.html via GET to the user.\n`);

    res.render(`index.njk`);
});

/**
 * This router handles all GET requests to the “read-a-db-record” directory,
 * specifically, queries to the database.
 */
app.get(`/read-a-db-record`, (req, res) => {
    db.collection(dbCollection).find().toArray((err, arrayObject) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(`User requested http://localhost:${port}/read-a-db-record.`);
            console.log(`Responding to request by submitting read-from-database.njk via GET to the user.\n`);

            res.render(`read-from-database.njk`, {mongoDBArray: arrayObject});
        }
    });
});

/**
 *
 */
app.get(`/create-a-db-record`, (req, res) => {
    res.render(`create-a-record-in-database.njk`);
});

/**
 * POST method route
 */
app.post(`/create-a-record`, (req, res) => {
    db.collection(dbCollection).insertOne(req.body, (err) => {
        console.log(req.body);

        if (err) {
            return console.log(err);
        } else {
            console.log(`Inserted a single record into Mongo via an HTML form using POST.\n`);

            res.redirect(`/read-a-db-record`);
        }
    });
});

/**
 * PUT method route
 */
app.put(`/edbob`, (req, res) => {
    db.collection(dbCollection)
        .findOneAndUpdate({name: `Yoda`}, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            sort: {_id: -1},
            upsert: true
        },
        (err, result) => {
            if (err) {
                return res.send(err);
            } else {
                console.log(`Updated a single document in Mongo via PUT.`);

                res.send(result);
            }
        });
});

app.get(`/delete-a-db-record`, (req, res) => {
    res.render(`delete-a-record-in-database.njk`);
});

/**
 * DELETE method route
 */
app.delete(`/users`, (req, res) => {
    db.collection(dbCollection)
        .findOneAndDelete({name: req.body.name}, (err, result) => {
            if (err) {
                return res.send(500, err);
            } else {
                res.send(`Deleted a single document in Mongo via DELETE.`);
                console.log(`Deleted a single document in Mongo via DELETE.`);
            }
        });
});
