// Delete Note Button On Click
$(document).on("click", ".deleteNote", function () {
    // Save the note's id which is connected to the delete button
    var thisId = $(this).attr("data-id");
    console.log("This ID is: " + thisId);
    
    $.ajax({
        method: "DELETE",
        url: "/articles/delete/" + thisId,
        data: note
    }).then(function (data) {
        console.log(data);
        console.log("note deleted");
        $("p").attr("data-id", thisId).html("");
    });
});

// Addnote button on click for a specific article
$(document).on("click", ".addNote", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $("#addNoteBtn").attr("data-id", thisId);
    $(".notesOverlay").css("display", "none");
    $("#addNoteWrapper").css("visibility", "inherit");
    console.log(".addNote function");
});
// Savenote button on click
$(document).on("click", "#addNoteBtn", function () {
    var thisId = $(this).attr("data-id");
    var newNote = $("#bodyinput").val();
    console.log(thisId);
    console.log($("#bodyinput").val());
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            note: newNote
        }
    })
        .then(function (data) {
            //Log response & empty notes field
            console.log(data);
            $("#notes").empty();
        });

    // empty input values & hide add note field
    $("#titleinput").val("");
    $("#bodyinput").val("");
    $("#addNoteWrapper").css("visibility", "hidden");
    $(".notesOverlay").css("display", "block");
    $(".notesBtn").attr("data-state", "1");
});

function showNotes() {
    var dataState = $(".notesBtn").attr("data-state");
    if (dataState === "0") {
        $(".notesOverlay").css("display", "block");
        $(".notesBtn").attr("data-state", "1");
        $(".notesBtn").text("Hide Notes");
    } else {
        $(".notesOverlay").css("display", "none");
        $(".notesBtn").attr("data-state", "0");
        $(".notesBtn").text("Show Notes");
    }
}