import { Observable } from "./Observable.js";

export class CountrySelector {
    constructor() {
        this.allCountriesBtn = document.querySelectorAll("[data-country]");
        this.dropdownBtnTxt = document.querySelector(".drop-btn");
        this.selectedCountry = new Observable("");
        this.addEventToAllCountries();
    }

    addEventToAllCountries = () => {
        this.allCountriesBtn.forEach((countryBtn) => {
            countryBtn.addEventListener("click", (e) => {
                this.selectedCountry.value =
                    e.target.getAttribute("data-country");
                this.dropdownBtnTxt.firstChild.textContent =
                    this.selectedCountry.value;
            });
        });
    };
}
