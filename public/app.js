$(document).ready(function () {
    // scrape when scrape button is clicked
    $(document).on("click", "#scrape", function (event) {
        event.preventDefault();
        console.log("ready!");
        $.ajax({
                method: "GET",
                url: "/articles",
            })
            .then(function (data) {
                // console.log('/ARTICLES DATA', data)
                // Need to iterate over the Data array
                // For each iteration, set the Title and the Link from each object
                // And then display the set title and link through DOM manipulation
                for (let i = 0; i < data.length; i++) {
                    console.log('data at i', data[i])
                    // $("#articles").append("<p> Title: " + data[i].title + "</p>")
                    // $("#articles").append("<p> Summary: " + data[i].summary + "</p>")
                    // $("#articles").append("<a href='" + data[i].link + "'>" + data[i].link + "</a><hr />")
                    //$("#articles").append(`<button type="button" class ="comment">` + `Comment Here </button>`)
                    // $("#articles").append(
                    //     `<form action="/notes">
                    //   Comment here: <input type="text" name="comment" class="input"><br>
                    //   <input type="submit" value="Submit" class="comment" data-id="` + data[i]._id + `">
                    // </form>`)

                    // in order to be able to use "this" and grab the data[i]._id, need to wrap it up in one single element. p can be clicked btw!
                    $("#articles").append("<p data-id='" + data[i]._id + "'>Click here to add a note!<br />Title: " + data[i].title + "<br />Summary: " + data[i].summary + "<br /><a href='" + data[i].link + "'>" + data[i].link + "</a></p></hr>");

                }
            })

    });


    // write to note when comment button is clicked
    // class = comment, id = _id from db
    // $(document).on("click", ".comment", function (event) {
    //     event.preventDefault();
    //     // Empty the notes from the note section
    //     $("#notes").empty();
    //     console.log("This", this);
    //     let value = $(".input").text();
    //     console.log("input:", value);
    // })

    // Whenever someone clicks a p tag
    $(document).on("click", "p", function (event) {
        event.preventDefault();
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag - id is from database
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/articles/" + thisId
            })
            // With that done, add the note information to the page
            .then(function (data) {
                console.log(data.title);
                // The title of the article
                $("#notes").append("<h2>" + data.title + "</h2>");
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
                $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    });

    // When you click the savenote button
    $(document).on("click", "#savenote", function (event) {
        event.preventDefault();

        // Grab the id associated with the article from the submit button
        let thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val()
                }
            })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });

    // When you click the deletenote button
    $(document).on("click", "#deletenote", function (event) {
        event.preventDefault();

        // Grab the id associated with the article from the submit button
        let thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from title input
                    title: "",
                    // Value taken from note textarea
                    body: ""
                }
            })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });
})


// Provide user a text area/input field and a button
// user types note in field and clicks button
// When button is clicked, note gets saved
// Note collection on DB needs to store the note, the note id, and the article id that the note belongs to