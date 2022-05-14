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
        document.querySelector("#latest-data").classList.add("card");
    };
    drawCountryTodayDataChart = (selectedCountry, continents) => {
        this.chartsFactory.drawCountryChart(
            selectedCountry,
            continents,
            this.continentSelector.selectedContinent.value,
            1,
            this.chartsFactory.todayDataChart
        );
        document.querySelector("#today-data").classList.add("card");
    };

    destroyChart = (chartWrapper) => {
        chartWrapper.chart?.destroy(); //optional chaining: if chartWrapper.chart !== null , then the destroy command will be executed.
        chartWrapper.chart = null;
    };

    drawRadarChart = (continents, continentName, countryName) => {
        const dataObj = this.chartsFactory.getObjOfCountryLatestCalculatedData(
            continents,
            continentName,
            countryName
        );
        this.chartsFactory.drawRadarChart(dataObj, countryName);
    };

    initializeCharts = (onSelectedCountryChanged) => {
        this.countrySelector = new CountrySelector();
        this.countrySelector.selectedCountry.addChangeListener(
            onSelectedCountryChanged
        );
        this.destroyChart(this.chartsFactory.latestDataChart);
        this.destroyChart(this.chartsFactory.todayDataChart);
        document.querySelector("#latest-data").classList.remove("card");
        document.querySelector("#today-data").classList.remove("card");
        document.querySelector(".country-chart").style.display = "none";
        document.querySelector(".radar-country-chart").style.display = "none";
        document.querySelector("#down-arrow").style.display = "none";
    };
}
