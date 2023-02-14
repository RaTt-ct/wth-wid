<template>
  <div>
    <v-card v-if="showWeather" max-width="456px" class="mx-auto mt-4 weather-card">
      <v-icon @click="showWeather = false" class="weather-settings">{{ icons.mdiCog }}</v-icon>
      <div v-for="(item, index) in cities" :key="index" class="weather-block mb-2">
        <v-card-title class="d-flex justify-space-between">
          <div>
            <h2>{{ item.name }}, {{ item.sys.country }}</h2>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="d-flex justify-space-between align-center flex-wrap">
            <div class="d-flex align-center flex-wrap">
              <v-img v-if="item.weather[0].main === 'Clouds'"
                src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png" width="128"></v-img>
              <v-img v-if="item.weather[0].main === 'Clear'"
                src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather01-512.png" width="128"></v-img>
              <v-img v-if="item.weather[0].main === 'Rain'"
                src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather07-512.png" width="128"></v-img>
              <v-img v-if="item.weather[0].main === 'Snow'"
                src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather13-512.png" width="128"></v-img>
              <span class="weather-temperature">{{ Math.round(item.main.temp - 273) }}<span
                  class="degrees-сelsius">&#176;С</span></span>
            </div>
            <div class="d-flex flex-column ml-2">
              <span>Feels like: {{ Math.round(item.main.feels_like - 273) }}<span
                  class="degrees-сelsius">&#176;С</span></span>
              <span>Maximum temperature: {{ Math.round(item.main.temp_max - 273) }}<span
                  class="degrees-сelsius">&#176;С</span></span>
              <span>Minimum temperature: {{ Math.round(item.main.temp_min - 273) }}<span
                  class="degrees-сelsius">&#176;С</span></span>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between flex-wrap">
            <span>
              <v-icon v-bind:style="{ 'transform': 'rotate(' + item.wind.deg + 'deg)' }">{{
                icons.mdiArrowUpThin
              }}</v-icon>
              {{ Math.round(item.wind.speed) }}m/s</span>
            <span>Humidity: {{ item.main.humidity }}%</span>
            <span>Pressure: {{ item.main.pressure }}</span>
            <span>Visibility: {{ item.visibility / 1000 }}km</span>
          </div>
        </v-card-text>
      </div>
    </v-card>
    <v-card v-else max-width="456px" class="mx-auto mt-4 settings-card">
      <v-card-title class="d-flex justify-space-between">
        <h2>Settings</h2>
        <v-icon @click="showWeather = true">{{ icons.mdiClose }}</v-icon>
      </v-card-title>
      <v-card-text>
        <v-list class="settings-list">
          <v-list-item v-for="(item, index) in cities" :key="index" draggable
            @dragstart="dragStartHandler($event, index)" @dragend="dragEndHandler($event, index)"
            class="d-flex justify-space-between settings-list-item mb-2">
            <div>
              <v-icon>{{ icons.mdiMenu }}</v-icon>
              <span class="ml-2">{{ item.name }},{{ item.sys.country }}</span>
            </div>
            <v-icon @click="deleteCity(index)">{{ icons.mdiDelete }}</v-icon>
          </v-list-item>
        </v-list>
        <div class="d-flex">
          <v-text-field v-model="addCityName" placeholder="Add city"
            @keydown.enter.prevent="addCity(addCityName)"></v-text-field>
          <v-icon @click="addCity(addCityName)">{{ icons.mdiPlus }}</v-icon>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {
  mdiCog,
  mdiArrowUpThin,
  mdiClose,
  mdiMenu,
  mdiDelete,
  mdiPlus
} from '@mdi/js'



export default {

  data: () => {
    return {
      showWeather: true,
      addCityName: '',
      movedCity: null,
      icons: {
        mdiCog,
        mdiArrowUpThin,
        mdiClose,
        mdiMenu,
        mdiDelete,
        mdiPlus
      }
    }
  },

  computed: {
    cities() {
      return this.$store.getters.cities;
    }
  },

  methods: {
    getCityData(latitude, longitude) {
      this.$store.dispatch("getCityInfo", { lat: latitude, lon: longitude });
    },

    deleteCity(index) {
      this.$store.dispatch("deleteCity", { index: index });
    },

    addCity(cityName) {
      this.$store.dispatch("addCity", { city: cityName });
      this.addCityName = '';
    },

    dragStartHandler(evt, index) {
      if (this.cities.length > 1) {
        evt.dataTransfer.dropEffect = 'move';
        evt.dataTransfer.effectAllowed = 'move';
        let city = { ...this.cities[index] };
        city = JSON.stringify(city);
        this.movedCity = city;
      };
    },

    dragEndHandler(evt, index) {
      if (this.cities.length > 1) {
        this.$store.commit("removeCity", { index: index });
        let changeIndexElement = () => {
          let elemListItemPosition = index * (56);
          let newElemListItemPoisition = elemListItemPosition + evt.offsetY;
          let newIndex = Math.round(newElemListItemPoisition / 56);
          this.$store.commit("moveCity", { index: newIndex, city: JSON.parse(this.movedCity) });
        };
        changeIndexElement();
      };
    }
  },

  created() {
    const successGeo = (position) => {
      const { latitude, longitude } = position.coords;
      this.getCityData(latitude, longitude);
    }
    navigator.geolocation.getCurrentPosition(successGeo);
  },

}
</script>

<style scoped lang="scss">
.weather-card {
  position: relative;
  min-width: 200px;
  min-height: 120px;

  .weather-settings {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .weather-block {
    border-bottom: 1px solid rgba($color: #e4e4e4, $alpha: 0.6);

    .weather-temperature {
      font-size: 48px;
      letter-spacing: 0px;
      word-break: keep-all;

      .degrees-сelsius {
        letter-spacing: -6px;
      }
    }
  }
}

.settings-card {
  .settings-list-item {
    background: #e7e7e7e7;
    transition: 0.5s;
  }

  .settings-list-item::after {
    content: none
  }
}
</style>
