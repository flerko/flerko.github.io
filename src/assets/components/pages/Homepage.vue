<template>
    <div class="homepage">

        <form class="homepage-form">
            <input
                    v-model="city"
                    class="homepage-form__input"
                    type="text"
                    placeholder="Enter city name"
            >
            <button
                    class="homepage-form__button"
                    @click.stop.prevent="submit()"
                    type="submit"
                    :disabled="disabled"
            >Send</button>
        </form>

        <div v-for="(city, index) in cities"
             class="city-block">
            <div class="city-block__name">City name: {{ city.name }}</div>
            <div class="city-block__temp">Temperature in the city: {{ city.temp }} °C</div>
            <div class="city-block__humidity">Humidity in the city: {{ city.humidity }}</div>
            <span class="close" @click="removeCity(city, index)"></span>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    const APIKEYWEATHER = 'a768c91a8514bd3c1d1efd02300f9f6a';
    const LS_PREFIX = 'cities-';

    const client = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather'
    });

    export default {
        data: () => ({
            city: null,
            cities: [],
            disabled: false
        }),

        methods: {
            submit: function() {
                if (!this.city) return

                this.disabled = true

                let request = '?q=' + this.city + '&APPID=' + APIKEYWEATHER
                let self = this
                client.get(request).then((response) => {
                    this.disabled = false
                    this.city = null
                    let currentCity = {
                        id: response.data.id,
                        name: response.data.name,
                        humidity: response.data.main.humidity,
                        temp: response.data.main.temp - 273.15
                    }

                    let lskey = LS_PREFIX + currentCity.id;
                    if (!localStorage.getItem(lskey)) {
                        localStorage.setItem(lskey, JSON.stringify(currentCity));
                        self.cities.push(currentCity)
                    }
                }).catch((error) => {
                    this.disabled = false
                    console.log(error)
                })

            },

            checkExistingCity: function() {
                if (localStorage.length) {
                    for (let i = 0; i < localStorage.length; i++) {
                        if (localStorage.key(i).indexOf(LS_PREFIX) !== -1) {
                            this.cities.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
                        }
                    }
                }
            },

            addCityByGeoCoord: function() {
                if (!navigator.geolocation){
                    return
                }

                let self = this
                function getGeodataFromApi(lat, long) {
                    let request = '?lat=' + lat + '&lon=' + long + '&APPID=' + APIKEYWEATHER

                    client.get(request).then((response) => {
                        let currentCity = {
                            id: response.data.id,
                            name: response.data.name,
                            humidity: response.data.main.humidity,
                            temp: response.data.main.temp - 273.15
                        }

                        let lskey = LS_PREFIX + currentCity.id;
                        if (!localStorage.getItem(lskey)) {
                            localStorage.setItem(lskey, JSON.stringify(currentCity));
                            self.cities.push(currentCity)
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }

                navigator.geolocation.getCurrentPosition (

                    function success(position) {
                        getGeodataFromApi(position.coords.latitude, position.coords.longitude)
                    },

                    function error(error_message) {
                        console.error('An error has occured while retrieving location', error_message)
                    }
                )
            },

            removeCity: function(city, index) {
                this.$swal({
                    title: 'Are you sure?',
                    showCancelButton: true
                })
                .then((data) => {
                    if (data.value) {
                        localStorage.removeItem(LS_PREFIX + city.id)
                        this.cities.splice(index, 1)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },

        mounted: function () {
            this.addCityByGeoCoord()
            this.checkExistingCity()
        },
    }
</script>
