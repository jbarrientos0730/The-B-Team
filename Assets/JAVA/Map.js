// url for ajax call "https://maps.googleapis.com/maps/api/geocode/json?address= ADDRESS GOES HERE &key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ"
// https://maps.googleapis.com/maps/api/place/textsearch/json?query=123+main+street&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ

//pass locations to this array based on query to the goople map API
var locations = [{lat: 41.845641, lng: -87.642812}, {lat: 41.845105, lng: -87.646127}, {lat: 41.841516,  lng: -87.646996}]; 
var map; 
var results;

$.ajax({
    url:"https://cors-anywhere.herokuapp.com/" + "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants&location=41.841819,-87.647275&radius=800&key=AIzaSyD0vzQtyAJtm_QdkUJ3g7qFuT3b7ipB8UQ",
    method: "GET",
}).then(function(response){
    results = response.results;
    console.log(results);
    addMarker(results);


})
function initMap(){
     map = new google.maps.Map(document.getElementById("map"), {
         center: {lat: 41.844334, lng: -87.645301}, //center the map based on the start location of the form
         zoom: 15
     });


 };


 function addMarker(coords){
    for(i = 0; i < coords.length; i++){
    var marker = new google.maps.Marker({
        position: coords[i].geometry.location,
        map: map
        })
    }
 };


