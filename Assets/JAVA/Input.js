var name = "";
var startLocation = "";
var budget = "";
var stayDuration = 0;

$(document).on("click", "button", function(){
    var name1 = $(this).attr("data-name");
    console.log(this);
});

$(document).on("click", "#get-started", function(event){

    event.preventDefault();
    console.log("Shelby is now gone");
    name = $("#user-name").val().trim();
    startLocation = $("#starting-point").val().trim();
    budget = $("#budget").val().trim();

    console.log(name)
    console.log(startLocation)
    console.log(budget)
    
});

