var mongoose = require("mongoose");

// Reference to Schema constructor
var Schema = mongoose.Schema;

// Create an ArticleSchema object
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Store Article model in variable
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model variable
module.exports = Article;
