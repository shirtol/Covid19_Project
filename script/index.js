import { CountryController } from "./CountryController.js";

document.querySelector(".fa-sync").addEventListener("click", () => {
    window.location.reload();
});

const countryController = await CountryController.build();

countryController.initializeView();
