var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// For scraping
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

//Configure handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Configure middleware
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  axios.get("http://www.echojs.com/").then(function(response) {
    console.log(response.data);
    var $ = cheerio.load(response.data);

    $("article h2").each(function() {
      // Scrape site & store scraped info into result object
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the result object
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function(err) {
          res.json(err)
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});

app.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.render("index", {article: dbArticle});
    })
    .catch(function(err) {
        res.json(err);
    })
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});


app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for deleting note
app.get("/articles/delete/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .delete("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
