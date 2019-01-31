// Initialize Firebase
var config = {
apiKey: "AIzaSyC9y7Y9O5YV6DdKSCYfUaK8pvYW3g5YPic",
authDomain: "the-overplanner-planner.firebaseapp.com",
databaseURL: "https://the-overplanner-planner.firebaseio.com",
projectId: "the-overplanner-planner",
storageBucket: "the-overplanner-planner.appspot.com",
messagingSenderId: "226946194379"
};

firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var startLocation = "";
var budget = 0;
var stayDuration = "";
var startDate = "";
var departureDate = "";

// Submitting the input for saves the values to access them in the rest of the app
$(document).on("click", "#get-started", function(event){

    event.preventDefault();
    name = $("#user-name").val().trim();
    startLocation = $("#starting-point").val().trim();
    budget = $("#budget").val().trim();
    stayDuration = $("stayDuration").val().trim();
    startDate = moment($("#arrival").val().trim(), "MM/DD/YYYY").format("X");
    departureDate = moment($("#departure").val().trim(), "MM/DD/YYYY").format("X");

// Logs the variable to make sure they are being captured
    console.log(name)
    console.log(startLocation)
    console.log(budget)
    console.log(stayDuration)
    console.log(startDate)
    console.log(departureDate)
 

    database.ref().on("value", function(snapshot) {
        name = snapshot.val().name;
        startLocation = snapshot.val().startLocation;
        budget = snapshot.val().budget;
        stayDuration = snapshot.val().stayDuration;
        startDate = snapshot.val().startDate;
        departureDate = snapshot.val().departureDate;

    });
    
    database.ref().push({
        name: name,
        startLocation: startLocation,
        budget: budget,
        stayDuration: stayDuration,
        startDate: startDate,
        departureDate: departureDate

    });
    
});



