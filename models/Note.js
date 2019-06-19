var mongoose = require("mongoose");

// Reference to Schema constructor
var Schema = mongoose.Schema;

// NoteSchema constructor
var NoteSchema = new Schema({
  body: String
});

// Create Note model
var Note = mongoose.model("Note", NoteSchema);

// Export Note model
module.exports = Note;
