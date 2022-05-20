const app = new Vue({
    el: '#app',
    data: {
        recommendations1: [],
        recommendations2: [],
        recommendations3: [],
        museums: [],
        coordinatesMuseums: [],
        addressMuseums: [],
        galleries: [],
        coordinatesGalleries: [],
        addressGalleries: [],
        attractions: [],
        coordinatesAttractions: [],
        addressAttractions: [],
        restaurants: [],
        coordinatesRestaurants: [],
        addressRestaurants: [],
        mountains: [],
        coordinatesMountains: [],
        addressMountains: [],
        beaches: [],
        coordinatesBeaches: [],
        addressBeaches: [],
        cities: [],
        coordinatesCities: [],
        addressCities: [],
        coordinates: [],
        showHoliday1: true,
        showHoliday2: false,
        showHoliday3: false,
        weatherForecast: [],
        currentLocationLat: '',
        currentLocationLng: '',
        travelBicycle: '',
        travelWalking: '',
        travelCar: '',
        newMarker: '',
        hotels: [],
        flights: [{ interchange: 0 }, { interchange: 0 }]
    },

    async mounted() {

        await axios
            .get('https://v0f9r0wiaf.execute-api.us-east-1.amazonaws.com/production/recommendations',
                {
                    headers: {

                        'Authorization': localStorage.token

                    },

                    params: {

                        user_id: localStorage.user_id

                    }
                }
            )
            .then(response => {

                let checkObj = Object.keys(response.data);

                if (checkObj.length != 0) {

                    this.recommendations1 = JSON.parse(response.data.Item.holiday1);

                    this.recommendations2 = JSON.parse(response.data.Item.holiday2);

                    this.recommendations3 = JSON.parse(response.data.Item.holiday3);

                    this.hotels = this.recommendations1.hotel;

                    this.flights = this.recommendations1.flight;

                    console.log(this.recommendations3)

                }

            })
            .catch(error => { console.log(error) })

        this.outputDetails(this.recommendations1.recommendation);

        this.showMap(this.recommendations1.city.coordinates);

        this.barChart();

        this.getWeather(this.recommendations1.weather);

        this.getLocation();

    },

    methods: {

        currentTab: function (holiday) {

            let getClass1, getClass2, getClass3;

            if (holiday === "Holiday1") {

                getClass1 = document.getElementById("holiday1").className = "current";
                getClass2 = document.getElementById("holiday2").className = "nav";
                getClass3 = document.getElementById("holiday3").className = "nav";

                this.showHoliday1 = true;
                this.showHoliday2 = false;
                this.showHoliday3 = false;

                this.museums = [];
                this.coordinatesMuseums = [];
                this.addressMuseums = [];
                this.galleries = [];
                this.coordinatesGalleries = [];
                this.addressGalleries = [];
                this.attractions = [];
                this.coordinatesAttractions = [];
                this.addressAttractions = [];
                this.restaurants = [];
                this.coordinatesRestaurants = [];
                this.addressRestaurants = [];
                this.mountains = [];
                this.coordinatesMuseums = [];
                this.addressMountains = [];
                this.beaches = [];
                this.coordinatesBeaches = [];
                this.addressBeaches = [];
                this.cities = [];
                this.coordinatesCities = [];
                this.addressCities = [];

                this.hotels = this.recommendations1.hotel;

                this.flights = this.recommendations1.flight;

                this.outputDetails(this.recommendations1.recommendation);

                this.showMap(this.recommendations1.city.coordinates);

                this.barChart();

                this.getWeather(this.recommendations1.weather);

                this.calcRoute(this.recommendations1.city.coordinates[1], this.recommendations1.city.coordinates[0]);

            }

            if (holiday === "Holiday2") {

                getClass1 = document.getElementById("holiday1").className = "nav";
                getClass2 = document.getElementById("holiday2").className = "current";
                getClass3 = document.getElementById("holiday3").className = "nav";

                this.showHoliday1 = false;
                this.showHoliday2 = true;
                this.showHoliday3 = false;

                this.museums = [];
                this.coordinatesMuseums = [];
                this.addressMuseums = [];
                this.galleries = [];
                this.coordinatesGalleries = [];
                this.addressGalleries = [];
                this.attractions = [];
                this.coordinatesAttractions = [];
                this.addressAttractions = [];
                this.restaurants = [];
                this.coordinatesRestaurants = [];
                this.addressRestaurants = [];
                this.mountains = [];
                this.coordinatesMuseums = [];
                this.addressMountains = [];
                this.beaches = [];
                this.coordinatesBeaches = [];
                this.addressBeaches = [];
                this.cities = [];
                this.coordinatesCities = [];
                this.addressCities = [];

                this.hotels = this.recommendations2.hotel;

                this.flights = this.recommendations2.flight;

                this.outputDetails(this.recommendations2.recommendation);

                this.showMap(this.recommendations2.city.coordinates);

                this.barChart();

                this.getWeather(this.recommendations2.weather);

                this.calcRoute(this.recommendations2.city.coordinates[1], this.recommendations2.city.coordinates[0]);

            }

            if (holiday === "Holiday3") {

                getClass1 = document.getElementById("holiday1").className = "nav";
                getClass2 = document.getElementById("holiday2").className = "nav";
                getClass3 = document.getElementById("holiday3").className = "current";

                this.showHoliday1 = false;
                this.showHoliday2 = false;
                this.showHoliday3 = true;

                this.museums = [];
                this.coordinatesMuseums = [];
                this.addressMuseums = [];
                this.galleries = [];
                this.coordinatesGalleries = [];
                this.addressGalleries = [];
                this.attractions = [];
                this.coordinatesAttractions = [];
                this.addressAttractions = [];
                this.restaurants = [];
                this.coordinatesRestaurants = [];
                this.addressRestaurants = [];
                this.mountains = [];
                this.coordinatesMuseums = [];
                this.addressMountains = [];
                this.beaches = [];
                this.coordinatesBeaches = [];
                this.addressBeaches = [];
                this.cities = [];
                this.coordinatesCities = [];
                this.addressCities = [];

                this.hotels = this.recommendations3.hotel;

                this.flights = this.recommendations3.flight;

                this.outputDetails(this.recommendations3.recommendation);

                this.showMap(this.recommendations3.city.coordinates);

                this.barChart();

                this.getWeather(this.recommendations3.weather);

                this.calcRoute(this.recommendations3.city.coordinates[1], this.recommendations3.city.coordinates[0]);

            }
        },

        showMap: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.coordinatesCities.length; i++) {

                addMarker(this.coordinatesCities[i].coordinates[1], this.coordinatesCities[i].coordinates[0], "\uea40", this.cities[i], this.addressCities[i])

            }

            for (let i = 0; i < this.coordinatesMuseums.length; i++) {

                addMarker(this.coordinatesMuseums[i].coordinates[1], this.coordinatesMuseums[i].coordinates[0], "\uea36", this.museums[i], this.addressMuseums[i])

            }

            for (let i = 0; i < this.coordinatesGalleries.length; i++) {

                addMarker(this.coordinatesGalleries[i].coordinates[1], this.coordinatesGalleries[i].coordinates[0], "\ue3f4", this.galleries[i], this.addressGalleries[i])

            }

            for (let i = 0; i < this.coordinatesAttractions.length; i++) {

                addMarker(this.coordinatesAttractions[i].coordinates[1], this.coordinatesAttractions[i].coordinates[0], "\uef75", this.attractions[i], this.addressAttractions[i])

            }

            for (let i = 0; i < this.coordinatesRestaurants.length; i++) {

                addMarker(this.coordinatesRestaurants[i].coordinates[1], this.coordinatesRestaurants[i].coordinates[0], "\ue56c", this.restaurants[i], this.addressMountains[i])

            }

            for (let i = 0; i < this.coordinatesMountains.length; i++) {

                addMarker(this.coordinatesMountains[i].coordinates[1], this.coordinatesMountains[i].coordinates[0], "\ue3f7", this.mountains[i], this.addressMountains[i])

            }

            for (let i = 0; i < this.coordinatesBeaches.length; i++) {

                addMarker(this.coordinatesBeaches[i].coordinates[1], this.coordinatesBeaches[i].coordinates[0], "\ueb3e", this.beaches[i], this.addressBeaches[i])

            }

        },

        calcRoute: function (latitude, longitude) {

            const directionsService = new google.maps.DirectionsService();

            directionsService
                .route({
                    origin: { lat: this.currentLocationLat, lng: this.currentLocationLng },
                    destination: { lat: latitude, lng: longitude },
                    travelMode: google.maps.TravelMode.BICYCLING,
                })
                .then((response) => {

                    this.travelBicycle = {};

                    this.travelBicycle = {

                        distance: response.routes[0].legs[0].distance.text,
                        time: response.routes[0].legs[0].duration.text

                    }

                })
                .catch((e) => { this.travelBicycle = { distance: "Not available", time: "Not available" } });

            directionsService
                .route({
                    origin: { lat: this.currentLocationLat, lng: this.currentLocationLng },
                    destination: { lat: latitude, lng: longitude },
                    travelMode: google.maps.TravelMode.WALKING,
                })
                .then((response) => {

                    this.travelWalking = {};

                    this.travelWalking = {

                        distance: response.routes[0].legs[0].distance.text,
                        time: response.routes[0].legs[0].duration.text

                    }

                })
                .catch((e) => this.travelWalking = { distance: "Not available", time: "Not available" });

            directionsService
                .route({
                    origin: { lat: this.currentLocationLat, lng: this.currentLocationLng },
                    destination: { lat: latitude, lng: longitude },
                    travelMode: google.maps.TravelMode.DRIVING,
                })
                .then((response) => {

                    this.travelCar = {};

                    let cleanString = response.routes[0].legs[0].distance.text

                    let fuelCost = parseInt(cleanString.replace(',', '')) * 0.29;

                    this.travelCar = {

                        distance: response.routes[0].legs[0].distance.text,
                        time: response.routes[0].legs[0].duration.text,
                        cost: (Math.round(fuelCost * 100) / 100).toFixed(2)

                    }

                })
                .catch((e) => this.travelCar = { distance: "Not available", time: "Not available", cost: "Not available" });

        },

        getLocation: function () {

            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(this.showPosition);

            } else {

                console.log("Geolocation is not supported by this browser.");

            }

        },

        showPosition: function (position) {

            this.currentLocationLat = position.coords.latitude;
            this.currentLocationLng = position.coords.longitude;

            this.calcRoute(this.coordinatesCities[0].coordinates[1], this.coordinatesCities[0].coordinates[0]);

        },

        showCities: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.coordinatesCities.length; i++) {

                addMarker(this.coordinatesCities[i].coordinates[1], this.coordinatesCities[i].coordinates[0], "\uea40", this.cities[i], this.addressCities[i]);

            }

        },

        showMuseums: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.coordinatesMuseums.length; i++) {

                addMarker(this.coordinatesMuseums[i].coordinates[1], this.coordinatesMuseums[i].coordinates[0], "\uea36", this.museums[i], this.addressMuseums[i])

            }

        },

        showGalleries: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.coordinatesGalleries.length; i++) {

                addMarker(this.coordinatesGalleries[i].coordinates[1], this.coordinatesGalleries[i].coordinates[0], "\ue3f4", this.galleries[i], this.addressGalleries[i])

            }

        },

        showAttractions: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.coordinatesAttractions.length; i++) {

                addMarker(this.coordinatesAttractions[i].coordinates[1], this.coordinatesAttractions[i].coordinates[0], "\uef75", this.attractions[i], this.addressAttractions[i])

            }

        },

        showRestaurants: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.coordinatesRestaurants.length; i++) {

                addMarker(this.coordinatesRestaurants[i].coordinates[1], this.coordinatesRestaurants[i].coordinates[0], "\ue56c", this.restaurants[i], this.addressRestaurants[i])

            }

        },

        showMountains: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.coordinatesMountains.length; i++) {

                addMarker(this.coordinatesMountains[i].coordinates[1], this.coordinatesMountains[i].coordinates[0], "\ue3f7", this.mountains[i], this.addressMountains[i])

            }

        },

        showBeaches: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.coordinatesBeaches.length; i++) {
     
                addMarker(this.coordinatesBeaches[i].coordinates[1], this.coordinatesBeaches[i].coordinates[0], "\ueb3e", this.beaches[i], this.addressBeaches[i])

            }

        },

        showHotels: function (coordinates) {

            const myLatLng = { lat: coordinates[1], lng: coordinates[0] };
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: myLatLng,
            });

            function addMarker(lat, lng, icon, name, address, website, price) {

                let newMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map,
                    label: {
                        text: icon,
                        fontFamily: "Material Icons",
                        color: "#ffffff",
                        fontSize: "15px",
                    },
                    title: "Material Icon Font Marker",
                });

                let infoWindow = new google.maps.InfoWindow({
                    content: "<h2>" + name + "</h2>" + "<p class='outputAddress'>" + address + "</p>" +
                        "<a class='bookHotel' href=" + website + "> Book Hotel £" + price + "</a>"
                })

                newMarker.addListener('click', function () {
                    infoWindow.open(map, newMarker);

                })

            }

            for (let i = 0; i < this.hotels.length; i++) {
   
                addMarker(this.hotels[i].coordinates[0], this.hotels[i].coordinates[1], "\ueb3e", this.hotels[i].name, this.hotels[i].address[0], this.hotels[i].website, this.hotels[i].price)

            }

        },

        outputDetails: function (data) {

            for (let i = 0; i < data.length; i++) {

                if (data[i].location_type.S === "museum") {

                    this.museums.push(data[i].name.S);
                    this.coordinatesMuseums.push(JSON.parse(data[i].geoJson.S));
                    this.addressMuseums.push(data[i].formatted_address.S);

                }

                if (data[i].location_type.S === "art_gallery") {

                    this.galleries.push(data[i].name.S);
                    this.coordinatesGalleries.push(JSON.parse(data[i].geoJson.S));
                    this.addressGalleries.push(data[i].formatted_address.S)

                }

                if (data[i].location_type.S === "tourist_attraction") {

                    this.attractions.push(data[i].name.S);
                    this.coordinatesAttractions.push(JSON.parse(data[i].geoJson.S));
                    this.addressAttractions.push(data[i].formatted_address.S)

                }

                if (data[i].location_type.S === "restaurant") {

                    this.restaurants.push(data[i].name.S);
                    this.coordinatesRestaurants.push(JSON.parse(data[i].geoJson.S));
                    this.addressRestaurants.push(data[i].formatted_address.S)

                }

                if (data[i].location_type.S === "beach") {

                    this.beaches.push(data[i].name.S);
                    this.coordinatesBeaches.push(JSON.parse(data[i].geoJson.S));
                    this.addressBeaches.push(data[i].formatted_address.S)

                }

                if (data[i].location_type.S === "mountain") {

                    this.mountains.push(data[i].name.S);
                    this.coordinatesMountains.push(JSON.parse(data[i].geoJson.S));
                    this.addressMountains.push(data[i].formatted_address.S)

                }

                if (data[i].location_type.S === "city") {

                    this.cities.push(data[i].name.S);
                    this.coordinatesCities.push(JSON.parse(data[i].geoJson.S));
                    this.addressCities.push(data[i].formatted_address.S)

                }

            }

        },

        barChart: function () {

            let recommMuseums = 0;
            let recommGalleries = 0;
            let recommAttractions = 0;
            let recommRestaurants = 0;
            let recommMountains = 0;
            let recommBeaches = 0;

            if (this.museums.length > 20) {

                recommMuseums = 20;

            } else {

                recommMuseums = this.museums.length;

            }

            if (this.galleries.length > 20) {

                recommGalleries = 20;

            } else {

                recommGalleries = this.galleries.length;

            }

            if (this.attractions.length > 20) {

                recommAttractions = 20;

            } else {

                recommAttractions = this.attractions.length;

            }

            if (this.restaurants.length > 20) {

                recommRestaurants = 20;

            } else {

                recommRestaurants = this.restaurants.length;

            }

            if (this.mountains.length > 20) {

                recommMountains = 20;

            } else {

                recommMountains = this.mountains.length;

            }

            if (this.beaches.length > 20) {

                recommBeaches = 20;

            } else {

                recommBeaches = this.beaches.length;

            }

            var trace1 = {
                x: ['Museum', 'Art Gallerie', 'Tourist Attraction', 'Foodie', 'Ski', 'Beach'],
                y: [localStorage.museum, localStorage.art_gallery, localStorage.tourist_attraction, localStorage.restaurant, localStorage.mountain, localStorage.seaside],
                name: 'Preferences',
                type: 'bar',
                marker: {
                    color: 'rgb(255, 145, 0)'
                }
            };

            var trace2 = {
                x: ['Museum', 'Art Gallerie', 'Tourist Attraction', 'Foodie', 'Ski', 'Beach'],
                y: [recommMuseums, recommGalleries, recommAttractions, recommRestaurants, recommMountains, recommBeaches],
                name: 'Recommendation',
                type: 'bar',
                marker: {
                    color: 'rgb(191, 2, 2)'
                }
            };

            var data = [trace1, trace2];

            var layout = {
                barmode: 'group', title: { text: 'Recommendation Accuracy', font: { color: 'rgb(191, 2, 2)', size: 25 } },
                paper_bgcolor: 'rgb(254,251,234)', plot_bgcolor: 'rgb(254,251,234)'
            };

            Plotly.newPlot('barChart', data, layout);

        },

        getWeather: function (data) {

            this.weatherForecast = [];

            for (let i = 0; i < data.length; i++) {

                let newObject = {

                    icon: data[i].icon,
                    day: data[i].day,
                    night: data[i].night,
                    description: data[i].description,
                    date: data[i].date

                }

                this.weatherForecast.push(newObject);

            }

        }

    }

});

