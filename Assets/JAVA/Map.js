// url for ajax call "https://maps.googleapis.com/maps/api/geocode/json?address= ADDRESS GOES HERE &key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ"
// https://maps.googleapis.com/maps/api/place/textsearch/json?query=123+main+street&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ
// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
// "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + startLocation + "&fields=location&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ"
//pass locations to this array based on query to the goople map API
var map; 
var results;
var startLatLng = {
 

}

var startUrl;
var name = "";
var startLocation = "";
var budget = "";
var stayDuration = 0;
var markers = [];
var markerSelection = [];
var activitySelection = [];
var results;
var resultsDistance;
var currentActivity = 0;
var directionsService;
var directionsDisplay;
var distBetween;

$(document).on("click", "#get-started", function(event){
    event.preventDefault();
    name = $("#user-name").val().trim();
    startLocation = $("#starting-point").val().trim();
    budget = $("#budget").val().trim();
    console.log(name)
    console.log(startLocation)
    console.log(budget)
    startUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + startLocation + "&inputtype=textquery&fields=geometry&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ"
    $.ajax({
        url :"https://cors-anywhere.herokuapp.com/" + startUrl,
        method: "GET"
    }).then(function(response){
        console.log(startUrl);
        console.log(response);
        startlat = response.candidates[0].geometry.location.lat;
        startlng = response.candidates[0].geometry.location.lng;
        startLatLng = response.candidates[0].geometry.location;
        map.panTo(response.candidates[0].geometry.location);
        $.ajax({
            url:"https://cors-anywhere.herokuapp.com/" + "https://maps.googleapis.com/maps/api/place/textsearch/json?input=restaurants&location=" + startlat + "," + startlng + "&radius=800&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ",
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
    markerNum = $(this).val();
    addItineraryChoice();
    
});
$(document).on("click","#route-button",  function(event){
    event.preventDefault();
    getRoutes();
})

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
    btnNum = num;
    markerSelection.push(markers[markerNum]);
    activitySelection.push(results[markerNum]);
    selectMarker = new google.maps.Marker({
        position: markers[markerNum].getPosition(),
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        map: map,
        zIndex: 2
    })
    $("#places-choices").empty();
    var btn = $("<button class= 'button-marker m-2 btn btn-primary' id = marker-number-" + i  + " value =" + i + ">");
    btn.append("<p> Name: " + results[markerNum].name + "</p>");
    btn.append("<p> Rating: " + results[markerNum].rating + "</p>");
    btn.append("<p>  Price level: " + results[markerNum].price_level + "</p>");
    // btn.append("<p> Hours: " + response[i].opening_hours + "</p>");
    $("#places-choice").append(btn);
    for (i = 0; i < markers.length; i++)
    {
        markers[i].setMap(null);
    };
    console.log(activitySelection);
    startlat = activitySelection[currentActivity].geometry.location.lat;
    console.log(startlat);
    startlng = activitySelection[currentActivity].geometry.location.lng;
    console.log(startlng);
    $.ajax({
        url:"https://cors-anywhere.herokuapp.com/" + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?input=restaurants&location=" + startlat + "," + startlng + "&radius=800&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ",
        method: "GET",
    }).then(function(response){
        results = response.results;
        addMarker(results);
        getDistanceBetween(results);


    })
    currentActivity++;
    console.log(activitySelection);

     
 }

 function addButtonChoices(response, distResponse){
   
     for (i = 0; i < response.length; i++)
     {
       
         //diplay name, hours, rating, price, distance from
        var btn = $("<button class= 'button-marker m-2 btn-primary' id = marker-number-" + i  + " value =" + i + ">");
        btn.append("<p> Name: " + response[i].name + "</p>");
        btn.append("<p> Rating: " + response[i].rating + "</p>");
        btn.append("<p>  Price level: " + response[i].price_level + "</p>");
        btn.append("<p>  Distance from last point: " + distResponse.rows[0].elements[i].distance.text + "</p>");
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

function getRoutes(){
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var startRoute;
    startRoute = activitySelection[0].geometry.location;
    var endRoute; 
    endRoute = activitySelection[activitySelection.length - 1].geometry.location;
    var wayPoints = [];
    if (activitySelection.length > 2)
    {
        for(i = 1; i < activitySelection.length -1; i++)
        {   
            var routeLatLng = {}
            routeLatLng.location = activitySelection[i].geometry.location;
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
        console.log(response);

    });
}

