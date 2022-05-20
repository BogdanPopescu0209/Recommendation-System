const app = new Vue({
    el: '#app',
    data: {
        showLogin: true,
        showRegister: false,
        showPreferencesPage1: false,
        showPreferencesPage2: false,
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        feedback: '',
        user: '',
        token: '',
        hotel_rating: 1,
        hotel_budget: 100,
        hotel_checkin: '',
        hotel_checkout: '',
        flight_budget: 100,
        flight: false,
        museum: 1,
        art_gallery: 1,
        tourist_attraction: 1,
        restaurant: 1,
        mountain: 1,
        seaside: 1,
        addPreferences: false,
        user_id: '',
        currentLocationLat: '',
        currentLocationLng: '',
        user_location: '',
        recommendations1: [],
        recommendations2: [],
        recommendations3: [],
        recommFeedback: ""
    },

    async mounted() {

        if (localStorage.name) {

            this.name = localStorage.name;
            this.user_id = localStorage.user_id;
            this.token = localStorage.token;
            this.recommLoading = localStorage.recommLoading;
            this.recommFeedback = localStorage.recommFeedback;
            this.routePreferencesPage1();
            this.getLocation();

            await axios
                .get('https://v0f9r0wiaf.execute-api.us-east-1.amazonaws.com/production/preferences',
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

                        this.museum = response.data.Item.museum;
                        this.art_gallery = response.data.Item.art_gallery;
                        this.tourist_attraction = response.data.Item.tourist_attraction;
                        this.restaurant = response.data.Item.restaurant;
                        this.mountain = response.data.Item.mountain;
                        this.seaside = response.data.Item.beach;
                        this.hotel_rating = response.data.Item.hotel_rating;
                        this.hotel_budget = response.data.Item.hotel_budget;
                        this.hotel_checkin = response.data.Item.hotel_checkin;
                        this.hotel_checkout = response.data.Item.hotel_checkout;
                        this.flight = response.data.Item.flight;
                        this.flight_budget = response.data.Item.flight_budget;

                        localStorage.museum = this.museum;
                        localStorage.art_gallery = this.art_gallery;
                        localStorage.tourist_attraction = this.tourist_attraction;
                        localStorage.restaurant = this.restaurant;
                        localStorage.mountain = this.mountain;
                        localStorage.seaside = this.seaside;

                        this.addPreferences = false;

                    }

                })
                .catch(error => {

                    if (error) {

                        this.addPreferences = true;

                    }
                })

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

                        this.recommFeedback = "Recommendations generated";
                        localStorage.recommFeedback = "Recommendations generated";

                        localStorage.removeItem("holiday1");
                        localStorage.removeItem("holiday2");
                        localStorage.removeItem("holiday3");

                        this.recommendations1 = JSON.parse(response.data.Item.holiday1);

                        this.recommendations2 = JSON.parse(response.data.Item.holiday2);

                        this.recommendations3 = JSON.parse(response.data.Item.holiday3);

                        localStorage.holiday1 = JSON.stringify({

                            type: this.recommendations1.details.type,
                            nights: this.recommendations1.nights,
                            city: this.recommendations1.city.name,
                            museums: this.recommendations1.details.museums,
                            galleries: this.recommendations1.details.galleries,
                            attractions: this.recommendations1.details.attractions,
                            restaurants: this.recommendations1.details.restaurants,
                            mountains: this.recommendations1.details.mountains,
                            beaches: this.recommendations1.details.beaches,
                            hotel: this.recommendations1.hotel[0].price,
                            flight: this.recommendations1.flight[0].price

                        })

                        localStorage.holiday2 = JSON.stringify({

                            type: this.recommendations2.details.type,
                            nights: this.recommendations2.nights,
                            city: this.recommendations2.city.name,
                            museums: this.recommendations2.details.museums,
                            galleries: this.recommendations2.details.galleries,
                            attractions: this.recommendations2.details.attractions,
                            restaurants: this.recommendations2.details.restaurants,
                            mountains: this.recommendations2.details.mountains,
                            beaches: this.recommendations2.details.beaches,
                            hotel: this.recommendations2.hotel[0].price,
                            flight: this.recommendations2.flight[0].price

                        })

                        localStorage.holiday3 = JSON.stringify({

                            type: this.recommendations3.details.type,
                            nights: this.recommendations3.nights,
                            city: this.recommendations3.city.name,
                            museums: this.recommendations3.details.museums,
                            galleries: this.recommendations3.details.galleries,
                            attractions: this.recommendations3.details.attractions,
                            restaurants: this.recommendations3.details.restaurants,
                            mountains: this.recommendations3.details.mountains,
                            beaches: this.recommendations3.details.beaches,
                            hotel: this.recommendations3.hotel[0].price,
                            flight: this.recommendations3.flight[0].price

                        })

                    }

                })
                .catch(error => { console.log(error) })
        }
    },

    methods: {

        routeLogin: function () {
            this.feedback = '';
            this.showLogin = true;
            this.showRegister = false;
            this.showPreferencesPage1 = false;
            this.showPreferencesPage2 = false;
        },

        routeRegister: function () {
            this.feedback = '';
            this.showLogin = false;
            this.showRegister = true;
            this.showPreferencesPage1 = false;
            this.showPreferencesPage2 = false;
        },

        routePreferencesPage1: function () {
            this.showLogin = false;
            this.showRegister = false;
            this.showPreferencesPage1 = true;
            this.showPreferencesPage2 = false;

        },

        routePreferencesPage2: function () {
            this.showLogin = false;
            this.showRegister = false;
            this.showPreferencesPage1 = false;
            this.showPreferencesPage2 = true;
        },

        register: function () {

            if (this.password != this.confirmPassword) {

                this.feedback = 'Passwords do not match';

            }

            if (this.name === '') {

                this.feedback = 'Name cannot be empty';

            }

            if (this.name != '' && this.password === this.confirmPassword) {

                const params = JSON.stringify({

                    "email": this.email,
                    "name": this.name,
                    "password": this.password,

                })

                axios
                    .post('https://v0f9r0wiaf.execute-api.us-east-1.amazonaws.com/production/register', params)
                    .then(response => {

                        if (response.data.errorMessage) {

                            this.feedback = response.data.errorMessage;

                        } else {

                            this.feedback = 'User successfully registered. Please sign in'

                        }

                    })
                    .catch(error => { console.log(error) })

            }

        },

        login: async function () {

            this.feedback = "Loading..."

            const params = JSON.stringify({

                "email": this.email,
                "password": this.password,

            })

            await axios
                .post('https://v0f9r0wiaf.execute-api.us-east-1.amazonaws.com/production/login', params)
                .then(response => {

                    if (response.data.errorMessage) {

                        this.feedback = response.data.errorMessage;

                    }

                    if (response.data.name) {

                        localStorage.name = response.data.name;
                        localStorage.user_id = response.data.user_id;
                        localStorage.token = response.data.token;
                        this.name = response.data.name;

                        this.routePreferencesPage1();

                    }

                })
                .catch(error => { console.log(error) });

        },

        save: async function () {

            localStorage.museum = this.museum;
            localStorage.art_gallery = this.art_gallery;
            localStorage.tourist_attraction = this.tourist_attraction;
            localStorage.restaurant = this.restaurant;
            localStorage.mountain = this.mountain;
            localStorage.seaside = this.seaside;

            const params = {

                user_id: this.user_id,
                museum: this.museum,
                art_gallery: this.art_gallery,
                tourist_attraction: this.tourist_attraction,
                beach: this.seaside,
                mountain: this.mountain,
                restaurant: this.restaurant,
                hotel_rating: this.hotel_rating,
                hotel_checkin: this.hotel_checkin,
                hotel_checkout: this.hotel_checkout,
                hotel_budget: this.hotel_budget,
                flight: this.flight,
                flight_budget: this.flight_budget,
                user_location: "London"

            };

            if (this.addPreferences === true) {

                this.recommFeedback = "Generating recommendations";
                localStorage.recommFeedback = "Generating recommendations";

                localStorage.holiday1 = JSON.stringify({});
                localStorage.holiday2 = JSON.stringify({});
                localStorage.holiday3 = JSON.stringify({});

                await axios
                    .post('https://v0f9r0wiaf.execute-api.us-east-1.amazonaws.com/production/preferences', params,
                        {
                            headers: {

                                'Authorization': localStorage.token

                            }
                        })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => { console.log(error) })

            }

            if (this.addPreferences === false) {

                this.recommFeedback = "Generating recommendations";
                localStorage.recommFeedback = "Generating recommendations";

                localStorage.holiday1 = JSON.stringify({});
                localStorage.holiday2 = JSON.stringify({});
                localStorage.holiday3 = JSON.stringify({});

                await axios
                    .put('https://v0f9r0wiaf.execute-api.us-east-1.amazonaws.com/production/preferences', params,
                        {
                            headers: {

                                'Authorization': localStorage.token

                            }
                        })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => { console.log(error) })

            }
        },

        logout: function () {

            localStorage.clear();
            this.routeLogin();

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

            this.getCurrentLocation();

        },

        getCurrentLocation: function () {

            const geocoder = new google.maps.Geocoder();

            const latlng = {
                lat: parseFloat(this.currentLocationLat),
                lng: parseFloat(this.currentLocationLng)
            };

            geocoder
                .geocode({ location: latlng })
                .then((response) => {

                    if (response.results[0]) {

                        this.user_location = response.results[0].address_components[2].long_name;

                    } else {

                        console.log("No results found");

                    }
                })
                .catch((e) => console.log("Geocoder failed due to: " + e));

        }
    }
});