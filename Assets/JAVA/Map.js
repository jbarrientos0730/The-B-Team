var map; 
var results;
var startLatLng = { 
}
var startUrl;
var startlat;
var startlng;
var name = "";
var date = "";
var startLocation = "";
var searchQuery = "bestplaces";
var milesWillingToTravel = 10;
var radius = 3000;
var stayDuration = 0;
var markers = [];
var markerSelection = [];
var activitySelection = [];
var results;
var resultsDistance;
var currentActivity = 1;
var directionsService;
var directionsDisplay;
var distBetween;
var expectedCost = 0;
var totalTravelTime = 0;
var savedTrips = [];

var database;

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

  database = firebase.database();

$(document).on("click", "#get-started", function(event){
    event.preventDefault();
    name = $("#user-name").val().trim();
    startLocation = $("#starting-point").val().trim();
    searchQuery =  $("#activity").val().trim();
    milesWillingToTravel = parseInt( $("#trip-distance").val().trim());
    // radius = Math.ceil(milesWillingToTravel * 1609.344);
    $("#miles-left").text("Miles Left: " + milesWillingToTravel);
    startUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + startLocation + "&inputtype=textquery&fields=geometry&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ"
    $.ajax({
        url :"https://cors-anywhere.herokuapp.com/" + startUrl,
        method: "GET"
    }).then(function(response){
        console.log(startUrl);
        console.log(response);
        activitySelection.push(response.candidates[0]);
        console.log("here",activitySelection);
        startlat = response.candidates[0].geometry.location.lat;
        startlng = response.candidates[0].geometry.location.lng;
        startLatLng = response.candidates[0].geometry.location;
        map.panTo(response.candidates[0].geometry.location);
        $.ajax({
            url:"https://cors-anywhere.herokuapp.com/" + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=" + searchQuery +"&location=" + startlat + "," + startlng + "&radius=" + radius + "&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ",
            method: "GET",
        }).then(function(response){
            results = response.results;
            console.log(results);
            addMarker(results);
            getDistanceBetween(results);
        })
    })
});
$(document).on('click', ".button-marker", function(event){
    event.preventDefault();
    markerNum = parseInt($(this).val());
    updateDistance();
    addItineraryChoice(markerNum);
    markerNum += 1;
    console.log(markerNum);
    // radius = Math.ceil(milesWillingToTravel * 1609.344);
    console.log(radius);
   

});
$(document).on("click","#route-button",  function(event){
    event.preventDefault();
    getRoutes(activitySelection);
})
$(document).on("click", "#save-button", function(event){
    event.preventDefault();
    name = $("#trip-name").val().trim();
    date = $("#date").val().trim();
    var savedActivities = [];
    savedTrip = {
        savedTrip : {
        name : name,
        date : date
        },
        activities : {
            activitySelection
        }
    };
    savedActivities.push(savedTrip);
    database.ref("saved-trips").push(savedTrip);
    addSavedTrips();
})
$(document).on("click", ".saved-trip", function(event){
    event.preventDefault();
    tripIndex = $(this).val();
    var saveActivity = [];
    saveActivity.push((savedTrips[tripIndex].activities.activitySelection));
    getRoutes(savedTrips[tripIndex].activities.activitySelection);
})
database.ref("saved-trips").on("child_added", function(snapshot){
    var tripButton = snapshot.val();
    savedTrips.push(tripButton);
    addSavedTrips();
    console.log(tripButton)
    console.log(snapshot.key);

})
function addSavedTrips(){
    $("#save-area").empty();
    if (savedTrips.length > 0){
        for (i = 0; i < savedTrips.length; i++)
    {
        console.log("Im in the firebase loop");
        var btn = $("<button>");
        btn.attr("value", i);
        btn.attr("name", savedTrips[i].savedTrip.name);
        btn.addClass("saved-trip btn btn-sm btn-primary btn-block");
        btn.append("<p> Trip Name: "+ savedTrips[i].savedTrip.name + "</p>");
        btn.append("<p> Trip Date: "+ savedTrips[i].savedTrip.date+ "</p>");
        $("#save-area").append(btn);
    }
    }
}
function initMap(){   
     map = new google.maps.Map(document.getElementById("map"), {
         center: {lat: 41.844334, lng: -87.645301}, //center the map based on the start location of the form
         zoom: 15
     });
 };
 function addMarker(coords){
    for(i = 0; i < coords.length; i++){
        markers[i] = new google.maps.Marker({
        position: coords[i].geometry.location,
        map: map,
        animation : google.maps.Animation.DROP,
        markerNumber: i,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        zIndex: 1
        })
    }    
    console.log(markers);
 };
function addItineraryChoice(num){  
        markerSelection.push(markers[num]);
        activitySelection.push(results[num]);
        console.log(activitySelection[currentActivity]);
        startlat = activitySelection[currentActivity].geometry.location.lat;
        console.log(startlat);
        startlng = activitySelection[currentActivity].geometry.location.lng;
        console.log(startlng);
        url = "https://cors-anywhere.herokuapp.com/" + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword="+ searchQuery + "&location=" + startlat + "," + startlng + "&radius=" + radius + "&opennow&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ";
        console.log(url);
        
        selectMarker = new google.maps.Marker({
            position: markers[num].getPosition(),
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            map: map,
            zIndex: 2
        })
        $("#places-choices").empty();
        var price =  results[num].price_level;
        if (price === undefined)
        {
            price = 0;
        }
        console.log(results[num]);
        var btn = $("<button class= 'col-2 button-marker m-2 btn btn-sm btn-primary' id = marker-number-" + i  + " value =" + i + ">");
        btn.append("<p class='font-weight-bold'> Name: " + results[num].name + "</p>");
        btn.append("<p> Rating: " + results[num].rating + "</p>");
        btn.append("<p>  Price level: " + price + "</p>");
        totalTravelTime +=  Math.floor(resultsDistance.rows[0].elements[num].duration.value/60);
        $("#travel-time").text("Total Walking Time: " + totalTravelTime + " minutes");
        expectedCost += (price * 20);
        $("#expected-cost").text("Expected Cost: $ " + expectedCost); 
        console.log(expectedCost)
        $("#places-choice").append(btn);
        for (i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        };
        $("#miles-left").text(milesWillingToTravel);
        if (milesWillingToTravel > 0)
        {
        $.ajax({
            url: url,
            method: "GET",
        }).then(function(response){
            results = response.results;
            startLatLng = activitySelection[currentActivity].geometry.location;
            addMarker(results);
            getDistanceBetween(results);
            currentActivity++;

        })
        console.log(currentActivity);
        }
        else if (milesWillingToTravel <=0)
        {
            $("#places-choices").empty();
        }
         
 }

 function addButtonChoices(response, distResponse){   
     for (i = 0; i < 10; i++)
     {
        var price =  response[i].price_level;
        if (price === undefined)
        {
            price = 0;
        }
         //diplay name, hours, rating, price, distance from
        var btn = $("<button class= 'col-2 button-marker m-2 btn btn-sm btn-primary' id = marker-number-" + i  + " value =" + i + ">");
        btn.append("<p class='font-weight-bold'> Name: " + response[i].name + "</p>");
        btn.append("<p> Rating: " + response[i].rating + "</p>");
        btn.append("<p>  Price level: " + price + "</p>");
        btn.append("<p>  Distance from last point: " + distResponse.rows[0].elements[i].distance.text + "</p>");
        btn.append("<p>  Walking Time: " + distResponse.rows[0].elements[i].duration.text + "</p>");
        $("#places-choices").append(btn);
     }
 }
 function deleteMarker(int){
     markers[int].setMap(null);
 }
 function getDistanceBetween(response){
    var destinations = [];
    var origin = [startLatLng];
    for (i = 0; i < response.length; i++)
    {
        destinations.push(response[i].geometry.location);
    }   
    var distancesBetween = new google.maps.DistanceMatrixService();
    distancesBetween.getDistanceMatrix({
        origins: origin,
        destinations: destinations,
        travelMode: 'WALKING',
        unitSystem: google.maps.UnitSystem.IMPERIAL
    },
    function(response){
        resultsDistance = response;
        console.log(response);
        addButtonChoices(results, resultsDistance);
    })     
 }
function getRoutes(Arr){
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var startRoute;
    startRoute = Arr[0].geometry.location;
    var endRoute; 
    endRoute = Arr[Arr.length - 1].geometry.location;
    var wayPoints = [];
    if (Arr.length > 2)
    {
        for(i = 1; i < Arr.length -1; i++)
        {   
            var routeLatLng = {}
            routeLatLng.location = Arr[i].geometry.location;
            wayPoints.push(routeLatLng);
        }
    }
    console.log(wayPoints);
    var routeOptions = {
        origin: startRoute, // take the place id of the starting location
        destination: endRoute, //take the place id of the last location in the activities array  
        waypoints : wayPoints, 
        travelMode : 'WALKING',        
    }
    directionsService.route(routeOptions
        , function(response){
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directions-panel"));
        $("#directions-button").show();
        console.log(response);
    });
}
function updateDistance (){

   var miles =  resultsDistance.rows["0"].elements[markerNum].distance.text;
   miles = miles.substring(0, 3);
   parseInt(miles); 
   console.log(resultsDistance.rows["0"].elements[markerNum].distance.text);
   console.log(milesWillingToTravel)
   console.log(miles);

   if(miles < 0 || miles === NaN)
   {
       milesWillingToTravel = 0;
   }
    console.log(milesWillingToTravel);
    milesWillingToTravel -= miles;
    milesDisplay = toString(milesWillingToTravel);
    milesDisplay = milesDisplay.substring(0, 2);
   $("#miles-left").text("Miles Left: " + milesDisplay);
};
addSavedTrips();
