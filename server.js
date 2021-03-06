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
//console.log(scrapeIt)

let PORT = process.env.PORT || 3005;

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
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Routes

// A GET route for scraping the  website

app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    // scrapeIt()
    // Make a request via axios to grab the HTML body from the site of your choice
    axios.get("https://www.thetimes.co.uk").then(function (response) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        let $ = cheerio.load(response.data);

        // An empty array to save the data that we'll scrape
        // let results = [];
        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        if ($(".Item-content") !== "") {
            let result = {};

            $(".Item-content").each(function (i, element) {
                // let title = $(element).children("h3").text();
                // let summary = $(element).children("p").text();
                // let link = $(element).find("a").attr("href");
                if ($(element).children("p").text() !== '') {
                    // results.push({
                    //     title: title,
                    //     summary: summary,
                    //     link: link
                    // })
                    result.title = $(this).children("h3").text();
                    result.summary = $(this).children("p").text();
                    result.link = $(this).find("a").attr("href");
                } else {
                    // results.push({
                    //     title: title,
                    //     link: link
                    // })
                    result.title = $(this).children("h3").text();
                    result.link = $(this).find("a").attr("href");
                }
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        // console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            })
        }
        res.send("scraped")
    });
})
// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
            _id: req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
// app.post("notes", function (req, res) {

//})


// more routes for CRUD notes
app.listen(PORT, () => console.log("You are listening on port " + PORT))