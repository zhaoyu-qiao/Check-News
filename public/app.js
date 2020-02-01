$(document).on("click", "#scrape", function () {
    console.log("ready!");
    $.ajax({
            method: "GET",
            url: "/api/all",
        })
        .then(function (data) {
            // console.log('/ARTICLES DATA', data)
            // Need to iterate over the Data array
            // For each iteration, set the Title and the Link from each object
            // And then display the set title and link through DOM manipulation
            for (let i = 0; i < data.length; i++) {
                console.log('data at i', data[i])
                $("#articles").append("<p> Title: " + data[i].title + "</p>")
                $("#articles").append("<p> Summary: " + data[i].summary + "</p>")
                $("#articles").append("<a href='" + data[i].link + "'>" + data[i].link + "</a>")
                $("#articles").append(`<button type="button" class ="comment">` + `Comment Here </button>`)

                // add the id as a custom html attr
            }
        })


});


// Provide user a text area/input field and a button
// user types note in field and clicks button
// When button is clicked, note gets saved
// Note collection on DB needs to store the note, the note id, and the article id that the note belongs to