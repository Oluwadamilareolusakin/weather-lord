import { renderData, capitalizeString,renderCountryName } from './auxiliaries.js';

import Styles from './stylesheets/main.scss';

const BASE_URL = "https://api.aerisapi.com/";
const CLIENT_ID = "sE56PqAn4S3wCf9HQw8n1";
const APP_SECRET = "eMGjiglIxVapPzQCk1dVFlCGFtvdJuq63gYPLhUm";
const SECRETS = `client_id=${CLIENT_ID}&client_secret=${APP_SECRET}`;

const getData = (endpoint, action, selector, extraQuery = '') => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const url = BASE_URL + `${endpoint.toLowerCase()}/` + 
                            `${action.toLowerCase()}${selector}${extraQuery.toLowerCase()}` + SECRETS;

    request.open('GET', url, true);
    request.onload = () => {
      if (request.status == 200){
        resolve(JSON.parse(request.response));
      } else {
        reject(request.statusText);
      }
    };

    request.onerror = () => {
      reject(request.statusText);
    };

    request.send();
  });
}


const getWeatherData = async (country) => {
  const countryData = await getData('countries', `${country}`, '?')
  const countryName = countryData.response.place.name;
  const countrySymbol = countryData.response.place.iso;
  renderCountryName(capitalizeString(countryName));
  const weatherData = await getData('observations', 'search', '?', `query=country:${countrySymbol}&`);
  extractRelevantData(weatherData);
}

const getRegion = (region) => {
  region = region.split('/');
  region = region[0];
  return region;
}

const extractRelevantData = (data) => {
  const weatherData = data.response[0];
  const longitude = weatherData.loc.long;
  const latitude = weatherData.loc.lat;
  const stationData = weatherData.ob;
  const icon = stationData.icon;
  const isDay = stationData.isDay;
  const tempCelcius = stationData.tempC;
  const tempFaherneit = stationData.tempF;
  const feelsLikeC = stationData.feelslikeC;
  const feelsLikeF = stationData.feelslikeF;
  const weather = stationData.weather;
  const region  = getRegion(weatherData.profile.tz);
  renderData(longitude, latitude, icon, isDay, tempCelcius, tempFaherneit, weather, region, feelsLikeC, feelsLikeF);
}

const fetchNewWeatherData = (e) => {
  e.preventDefault();
  const form = document.querySelector('.search-form');
  const country = form[0].value;
  getWeatherData(country);
  }
  
  const addEventListeners = () => {
  document.querySelector('.search-btn').addEventListener('click', (event) => fetchNewWeatherData(event));
  }
  
  window.onload = () => {
  getWeatherData('nigeria');
  addEventListeners();
  }

  
  
