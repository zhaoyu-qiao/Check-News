let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
let axios = require("axios");
let cheerio = require("cheerio")

// Require all models
let db = require("./models");
let scrapeIt = require("./scrape")
console.log(scrapeIt)

let PORT = 3005;

// Initialize Express
let app = express();

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// ??? what is the mongodb url "mongolab-dimensional-89227"
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes

// A GET route for scraping the  website

app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    scrapeIt()
    res.send("scraped")
});

app.get("/api/all", function (req, res) {
    db.Article.find({}).then(data => {

        res.json(
            // "don't panic": true,
            // 6: new Date()
            data)
    })
    //res["don't panic"]
    //res[3*2]
})


// more routes for CRUD notes
app.listen(PORT, () => console.log("You are listening on port " + PORT))