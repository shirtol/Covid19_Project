import { Country } from "./Country.js";
import { CountryUI } from "./CountryUI.js";
import { Utils } from "./Utils.js";

/**
 * @class
 */
export class CountryController {
    /**
     *
     * @returns {Promise<CountryController>}
     */
    static async build() {
        const continentsObj = await CountryController.getContinentsData();
        return new CountryController(continentsObj);
    }

    /**
     *
     * @returns {Promise <Country[]>}
     */
    static getArrOfCountries = async () => {
        try {
            const data = await Utils.getFetchedData(
                "https://corona-api.com/countries"
            );
            const specificData = data.data.map(
                (country) => new Country(country)
            );

            return specificData;
        } catch (err) {
            console.log(err);
        }
    };

    /**
     *
     * @returns {Promise<{"":Country[],Africa:Country[],Americas:Country[],Asia:Country[],Europe:Country[], Oceania:Country[]}>}
     */

    static getContinentsData = async () => {
        try {
            const data = await Utils.getFetchedData(
                "https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1"
            );
            // const specificData = {};
            const countriesArr = await CountryController.getArrOfCountries();
            return data.reduce((acc, country) => {
                const currCountry = countriesArr.find(
                    (state) => state.name === country.name.common
                );
                if (currCountry !== undefined) {
                    acc[country.region] = [
                        ...(acc[country.region] || []),
                        currCountry,
                    ];
                }
                return acc;
            }, {});
        } catch (err) {
            console.log(err);
        }
    };

    /**
     *
     * @param {{"":Country[],Africa:Country[],Americas:Country[],Asia:Country[],Europe:Country[], Oceania:Country[]}} continentsObj
     */
    constructor(continentsObj) {
        /**
         *
         * @type {{"":Country[],Africa:Country[],Americas:Country[],Asia:Country[],Europe:Country[], Oceania:Country[]}}
         */
        this.continents = continentsObj;

        /**
         * @type {CountryUI}
         */
        this.countryUI = new CountryUI();
    }

    initializeView = () => {
        this.addEventToCountriesBtn();
        this.closeDropdownWhenClickOnWindow();
        this.countryUI.drawChart(this.continents, "Africa");
        this.countryUI.createDropdownCountiesElements(
            this.continents,
            "Africa"
        );
        this.countryUI.continentSelector.selectedContinent.addChangeListener(
            (selectedContinent) =>
                this.countryUI.drawChart(
                    this.continents,
                    selectedContinent,
                    "critical"
                )
        );
        this.countryUI.continentSelector.selectedContinent.addChangeListener(
            (selectedContinent) =>
                this.countryUI.createDropdownCountiesElements(
                    this.continents,
                    selectedContinent
                )
        );
    };

    addEventToCountriesBtn = () => {
        this.countryUI.countriesDropdownBtn.addEventListener("click", (e) => {
            console.log(e.target);
            this.countryUI.countriesDropdownMenu.classList.toggle("show");
        });
    };

    closeDropdownWhenClickOnWindow = () => {
        window.onclick = (e) => {
            if (!e.target.classList.contains("drop-btn")) {
                const myDropdown = this.countryUI.countriesDropdownMenu;
                if (myDropdown.classList.contains("show")) {
                    myDropdown.classList.remove("show");
                }
            }
        };
    };
}
