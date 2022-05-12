//corona
// const res = await fetch("https://corona-api.com/countries");
// console.log(res);

import { CountryController } from "./CountryController.js";

// const data = await res.json();
// console.log(data);

//continents
// temporary approval: https://cors-anywhere.herokuapp.com/corsdemo
// const res2 = await fetch(
//     "https://cors-anywhere.herokuapp.com/https://restcountries.herokuapp.com/api/v1"
// );

// const data2 = await res2.json();

// console.log(res2);
// console.log(data2);

const countryController = await CountryController.build();

console.log(countryController);
