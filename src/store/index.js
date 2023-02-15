import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
let API_URL = "https://api.openweathermap.org/data/2.5/weather?";
let Api_Key = "4b080fa600aeaf894507963c0125c05b";

export default new Vuex.Store({
  state: {
    cities: [],
  },

  getters: {
    cities: (state) => {
      return state.cities;
    },
  },

  mutations: {
    setCityInfo: (state, payload) => {
      let cities = [];
      if (!localStorage.getItem("CityInfo")) {
        cities.push(payload);
        localStorage.setItem("CityInfo", JSON.stringify(cities));
        state.cities = cities;
      } else {
        state.cities = JSON.parse(localStorage.getItem("CityInfo"));
      }
    },

    addCity: (state, payload) => {
      state.cities.push(payload);
      localStorage.setItem("CityInfo", JSON.stringify(state.cities));
    },

    moveCity: (state, payload) => {
      state.cities.splice(payload.index, 0, payload.city);
      localStorage.removeItem("CityInfo");
      localStorage.setItem("CityInfo", JSON.stringify(state.cities));
    },

    deleteCity: (state, payload) => {
      let cities = JSON.parse(localStorage.getItem("CityInfo"));
      cities.splice(payload, 1);
      if (cities.length === 0) {
        localStorage.removeItem("CityInfo");
        state.cities = [];
      } else {
        localStorage.setItem("CityInfo", JSON.stringify(cities));
        state.cities = cities;
      }
    },

    removeCity: (state, payload) => {
      let cities = state.cities;
      cities = cities.filter((city, index) => index !== payload.index);
      state.cities = cities;
    },
  },

  actions: {
    getCityInfo: async (context, payload) => {
      if (!localStorage.getItem("CityInfo")) {
        const api =
          API_URL +
          "lat=" +
          payload.lat +
          "&lon=" +
          payload.lon +
          "&appid=" +
          Api_Key;
        await axios.get(api).then(function (response) {
          context.commit("setCityInfo", response.data);
        });
      } else {
        context.commit("setCityInfo");
      }
    },

    addCity: async (context, payload) => {
      const api = API_URL + "q=" + payload.city + "&appid=" + Api_Key;
      await axios.get(api).then(function (response) {
        context.commit("addCity", response.data);
      });
    },

    deleteCity: async (context, payload) => {
      context.commit("deleteCity", payload.index);
    },
  },

  modules: {},
});
