import { CountryController } from "./CountryController.js";

const countryController = await CountryController.build();

console.log(countryController);

countryController.initializeView();

console.log(countryController.continents);
