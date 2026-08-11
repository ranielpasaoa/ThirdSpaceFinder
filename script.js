const searchBar = document.getElementById("searchBar");
const homeContent = document.querySelector("#homeContent");
const searchResults = document.querySelector("#searchResults");

searchBar.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchThirdSpaces();
    }
});

async function searchThirdSpaces() {
    const searchText = searchBar.value.trim();
    let query;

    if (searchText === "") {
        query = "?$limit=50";
    } else {
        query = "?$q=" + searchText;
    }

    homeContent.style.display = "none"; //hides the home page  
    searchResults.style.display = "block"; //shows search results page
    searchResults.innerHTML = "";

    //Parks
    const parkResponse = await fetch(parkAPI + query);
    const parks = await parkResponse.json();
    parks.forEach(function(park) {
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${park.signname || "Unnamed Park"}</h3>
            <p>Type: Park</p>
            <p>Address: ${park.address || "No address available"}</p>
        </div>`;
    });


    //Pools
    const poolResponse = await fetch(poolAPI + query);
    const pools = await poolResponse.json();
    pools.forEach(function(pool) {
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${pool.name || "Unnamed Pool"}</h3>
            <p>Type: Pool</p>
            <p>Address: ${pool.address || "No address available"}</p>
        </div>`;
    });

    //Museums
    const museumResponse = await fetch(museumAPI + query);
    const museums = await museumResponse.json();
    museums.forEach(function(museum) {
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${museum.name || "Unnamed Museum"}</h3>
            <p>Type: Museum</p>
            <p>Address: ${museum.address || "No address available"}</p>
        </div>`;
    });

    //Restaurants
    const restaurantResponse = await fetch(restaurantAPI + query);
    const restaurants = await restaurantResponse.json();
    restaurants.forEach(function(restaurant) {
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${restaurant.dba || "Unnamed Restaurant"}</h3>
            <p>Type: Restaurant</p>
            <p>Address: ${restaurant.address || "No address available"}</p>
        </div>`;
    });

    //Libraries
    const libraryResponse = await fetch(qplAPI + query);
    const libraries = await libraryResponse.json();
    libraries.forEach(function(library) {
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${library.name || "Unnamed Library"}</h3>
            <p>Type: Library</p>
            <p>Address: ${library.address || "No address available"}</p>
        </div>`;
    });
}








// "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//                     }
//                 });
//             },
//             () => {
//                 console.warn("Geolocation permission denied or unavailable.");
//             }
//         );
//     }
// }

// // Function to search for nearby places
// function findNearbyPlaces() {
//     if (!userMarker) {
//         alert("User location not found yet. Please allow location access.");
//         return;
//     }

//     const request = {
//         location: userMarker.getPosition(),
//         radius: 1500, // in meters
//         type: ["restaurant", "cafe", "store"], // Change to your desired place types
//     };

//     service = new google.maps.places.PlacesService(map);
//     service.nearbySearch(request, (results, status) => {
//         if (status === google.maps.places.PlacesServiceStatus.OK) {
//             results.forEach((place) => {
//                 createMarker(place);
//             });
//         } else {
//             console.error("Nearby search failed:", status);
//         }
//     });
// }

// // Create a marker for each place
// function createMarker(place) {
//     if (!place.geometry || !place.geometry.location) return;

//     const marker = new google.maps.Marker({
//         map,
//         position: place.geometry.location,
//     });

//     google.maps.event.addListener(marker, "click", () => {
//         infowindow.setContent(place.name || "Unnamed Place");
//         infowindow.open(map, marker);
//     });
// }

// let map;
// let service;
// let infowindow;
// let userMarker;

// function initMap() {
//     // Default center (will update to user's location)
//     const defaultLocation = { lat: 35.7796, lng: -78.6382 }; // Example: Raleigh, NC

//     map = new google.maps.Map(document.getElementById("map"), {
//         center: defaultLocation,
//         zoom: 14,
//     });

//     infowindow = new google.maps.InfoWindow();

//     // Try to get user's location
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const userLocation = {
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 };
//                 map.setCenter(userLocation);

//                 // Mark user's location
//                 userMarker = new google.maps.Marker({
//                     position: userLocation,
//                     map: map,
//                     title: "You are here",
//                     icon: {
//                         url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//                     }
//                 });
//             },
//             () => {
//                 console.warn("Geolocation permission denied or unavailable.");
//             }
//         );
//     }
// }

// // Function to search for nearby places
// function findNearbyPlaces() {
//     if (!userMarker) {
//         alert("User location not found yet. Please allow location access.");
//         return;
//     }

//     const request = {
//         location: userMarker.getPosition(),
//         radius: 1500, // in meters
//         type: ["restaurant", "cafe", "store"], // Change to your desired place types
//     };

//     service = new google.maps.places.PlacesService(map);
//     service.nearbySearch(request, (results, status) => {
//         if (status === google.maps.places.PlacesServiceStatus.OK) {
//             results.forEach((place) => {
//                 createMarker(place);
//             });
//         } else {
//             console.error("Nearby search failed:", status);
//         }
//     });
// }

// // Create a marker for each place
// function createMarker(place) {
//     if (!place.geometry || !place.geometry.location) return;

//     const marker = new google.maps.Marker({
//         map,
//         position: place.geometry.location,
//     });

//     google.maps.event.addListener(marker, "click", () => {
//         infowindow.setContent(place.name || "Unnamed Place");
//         infowindow.open(map, marker);
//     });
// }

// let map;
// let service;
// let infowindow;
// let userMarker;

// function initMap() {
//     // Default center (will update to user's location)
//     const defaultLocation = { lat: 35.7796, lng: -78.6382 }; // Example: Raleigh, NC

//     map = new google.maps.Map(document.getElementById("map"), {
//         center: defaultLocation,
//         zoom: 14,
//     });

//     infowindow = new google.maps.InfoWindow();

//     // Try to get user's location
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const userLocation = {
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 };
//                 map.setCenter(userLocation);

//                 // Mark user's location
//                 userMarker = new google.maps.Marker({
//                     position: userLocation,
//                     map: map,
//                     title: "You are here",
//                     icon: {
//                         url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//                     }
//                 });
//             },
//             () => {
//                 console.warn("Geolocation permission denied or unavailable.");
//             }
//         );
//     }
// }

// // Function to search for nearby places
// function findNearbyPlaces() {
//     if (!userMarker) {
//         alert("User location not found yet. Please allow location access.");
//         return;
//     }

//     const request = {
//         location: userMarker.getPosition(),
//         radius: 1500, // in meters
//         type: ["restaurant", "cafe", "store"], // Change to your desired place types
//     };

//     service = new google.maps.places.PlacesService(map);
//     service.nearbySearch(request, (results, status) => {
//         if (status === google.maps.places.PlacesServiceStatus.OK) {
//             results.forEach((place) => {
//                 createMarker(place);
//             });
//         } else {
//             console.error("Nearby search failed:", status);
//         }
//     });
// }

// // Create a marker for each place
// function createMarker(place) {
//     if (!place.geometry || !place.geometry.location) return;

//     const marker = new google.maps.Marker({
//         map,
//         position: place.geometry.location,
//     });

//     google.maps.event.addListener(marker, "click", () => {
//         infowindow.setContent(place.name || "Unnamed Place");
//         infowindow.open(map, marker);
//     });
// }

