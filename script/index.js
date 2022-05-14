import { CountryController } from "./CountryController.js";

document.querySelector(".fa-sync").addEventListener("click", () => {
    window.location.reload();
});

const countryController = await CountryController.build();

console.log(countryController);

countryController.initializeView();

console.log(countryController.continents);
