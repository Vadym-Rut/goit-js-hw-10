export const fetchCountries = (value) => {
     return fetch(`https://restcountries.com/v2/name/${value}?fields=name,capital,population,flags,languages`)    
    }

