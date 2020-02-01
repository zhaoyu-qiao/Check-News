// Using this template, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save information from the page in a result array, and log it to the console.

let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// let axios = require("axios");
//let cheerio = require("cheerio")

// Require all models
let db = require("./models");

// let PORT = 3005;

// // Initialize Express
// let app = express();

// // Configure middleware

// // Use morgan logger for logging requests
// app.use(logger("dev"));
// // Parse request body as JSON
// app.use(express.urlencoded({
//     extended: true
// }));
// app.use(express.json());
// // Make public a static folder
// app.use(express.static("public"));
let cheerio = require("cheerio");
let axios = require("axios");
//let db = require("./models"); 
function scrapeIt() {
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

        // Log the results once you've looped through each of the elements found with cheerio
        console.log(result);

    });
}
module.exports = scrapeIt