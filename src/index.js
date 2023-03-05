import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import {fetchCountries}  from './fetchCountries';

const countrySearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

countrySearch.addEventListener('input', debounce((onSearch), DEBOUNCE_DELAY));

function onSearch() {
  let countryName = countrySearch.value.trim();
  if (countryName === '') {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return 
  }

  fetchCountries(countryName).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  })
    .then(data => {
      const arrCountryLanguages = data.map(item => item.languages).map(item => item.map(item => item.name));
      if (data.length > 10) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        return  
      }
      else if (data.length > 1 && data.length <= 10) {
        const markup = data.map(item => `<li class='country-item'><img src="${item.flags.svg}" alt="Flag ${item.name}" width="50"><span> ${item.name}</span></li>`).join('');
        countryList.innerHTML = markup;
        countryInfo.innerHTML = '';
        return
      }
      else if (data.length === 1) {
        const cardMarkup = data.map(item => `<img src="${item.flags.svg}" alt="Flag ${item.name}" width="50">
        <h2 class='country-name'>${item.name}</h2>
        <p><b>Capital:</b> ${item.capital}</p>
        <p><b>Population:</b> ${item.population}</p>
        <p><b>Languages:</b> ${arrCountryLanguages}</p>`).join('');
        countryInfo.innerHTML = cardMarkup;
        countryList.innerHTML = '';
        return
      }
  })
    .catch(() => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure("Oops, there is no country with that name");
  });
}

