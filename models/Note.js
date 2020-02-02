// note need to reference an article
// FE: put the ObjectID hash (_id) into a data-attribute, ObjectID is from Article collection.
// BE: model: consolut the class activity "populate" in the name
// routes: use the populate keyword

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NoteSchema = new Schema({
    // `title` is of type String
    title: String,
    // `body` is of type String
    body: String
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;