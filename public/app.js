// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".deleteNote", function() {
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log("This ID is: "+thisId);
//   // Empty the notes from the note section
//   $(".notes p").empty();

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
    //   // The title of the article
    //   $("#notes").append("<h2>" + data.title + "</h2>");
    //   // An input to enter a new title
    //   $("#notes").append("<input id='titleinput' name='title' >");
    //   // A textarea to add a new note body
    //   $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    //   // A button to submit a new note, with the id of the article saved to it
    //   $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
        $(".addNote").attr("data-id",thisId).css("display","none");
        $(".deleteNote").attr("data-id",thisId).css("display","initial");
      } else {
        $(".addNote").attr("data-id",thisId).css("display","initial");
        $(".deleteNote").attr("data-id",thisId).css("display","none");
      }
    });
});
// When you click the addnote button on a specific article
function addNote() {
    var thisId = $(this).attr("data-id");
    $("#addNoteBtn").attr("data-id", thisId);
    $(".notesOverlay").css("display","none");
    $("#addNoteWrapper").css("visibility","inherit");
    console.log(".addNote function");
}
// When you click the savenote button
$(document).on("click", "#addNoteBtn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
    //   // Value taken from title input
    //   title: $("#titleinput").val(),
      // Value taken from note textarea
      note: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $("#addNoteWrapper").css("visibility","hidden");
  $(".notesOverlay").css("display","block");
  $(".notesBtn").attr("data-state","1");
});

// $(".notesBtn").click(function() {
//     event.preventDefault();
//     $(".notesOverlay").css("display","block");
// });

function showNotes() {
    var dataState = $(".notesBtn").attr("data-state");
    if (dataState === "0") {
        $(".notesOverlay").css("display","block");
        $(".notesBtn").attr("data-state","1");
        $(".notesBtn").text("Hide Notes");
    } else {
        $(".notesOverlay").css("display","none");
        $(".notesBtn").attr("data-state","0");
        $(".notesBtn").text("Show Notes");
    }
}