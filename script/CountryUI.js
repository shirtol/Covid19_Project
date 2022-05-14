import { ChartsFactory } from "./ChartsFactory.js";
import { ContinentSelector } from "./ContinentSelector.js";
import { CountrySelector } from "./CountrySelector.js";

export class CountryUI {
    constructor() {
        this.countriesDropdownMenu = document.querySelector("#all-countries");
        this.countriesDropdownBtn = document.querySelector(".drop-btn");
        this.continentSelector = new ContinentSelector();
        this.countrySelector = null;

        this.chartsFactory = new ChartsFactory();
    }

    createDropdownCountriesElements = (
        continents,
        continentName = "Africa"
    ) => {
        while (this.countriesDropdownMenu.firstChild) {
            this.countriesDropdownMenu.removeChild(
                this.countriesDropdownMenu.firstChild
            );
        }
        continents[continentName].forEach((country) => {
            const element = document.createElement("div");
            element.setAttribute("data-country", country.name);
            element.textContent = `${country.name}`;
            this.countriesDropdownMenu.appendChild(element);
        });
        this.countrySelector = new CountrySelector();
    };

    drawCountryLatestDataChart = (selectedCountry, continents) => {
        this.chartsFactory.drawCountryChart(
            selectedCountry,
            continents,
            this.continentSelector.selectedContinent.value,
            0,
            this.chartsFactory.latestDataChart
        );
    };
    drawCountryTodayDataChart = (selectedCountry, continents) => {
        this.chartsFactory.drawCountryChart(
            selectedCountry,
            continents,
            this.continentSelector.selectedContinent.value,
            1,
            this.chartsFactory.todayDataChart
        );
    };
}
