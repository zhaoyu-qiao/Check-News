# Check-News
A web app that lets users view and leave comments on the latest news on https://www.thetimes.co.uk/.

This app scrapes the news from https://www.thetimes.co.uk/ and let the user review the news, and comment on each and every news article,to keep a record of notes, also deleting them when not needed.

## The database is powered my mongodb and mongoose
- create a database use below commands:
mongo
use mongoHeadlines // database name
- Models folder including Article model and Note model to use mongoose to create schemas which defined the articles and notes collections.
- Article Schema include a note property which reference to Note model so they have a connection to be linked between each other.

## The server is boosted by express on node.js
- route /scrape handles the scraping function from the website, and save data to the articles collection in the database.
- route /articles finds all documents from the articles collection in the database.
- route /articles/:id serves each individual article, and allow user to post note onto or delete from.

## Front end is supported by bootstrap and javascript
- Scrape button allows you to scrape the news and display it onto the page
- clicking on an article allows you to add or delete a note related to this article.

**Screenshots** are below to show different functions:

### Scrape
![Scrape](/public/images/scrape.png)

### Add note
![Scrape](/public/images/add-note.png)

### Delete note
![Scrape](/public/images/delete-note.png)








