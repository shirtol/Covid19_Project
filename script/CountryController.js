import { Country } from "./Country.js";
import { CountryUI } from "./CountryUI.js";
import { Utils } from "./Utils.js";
import { CountrySelector } from "./CountrySelector.js";
import { LocalStorageWrapper } from "./LocalStorageWrapper.js";
import { TimeUtils } from "./TimeUtils.js";

/**
 * @class
 */
export class CountryController {
    /**
     *
     * @type {string}
     */
    static get CONTINENTS_OBJ_IDENTIFIER() {
        return "continentsObj";
    }

    /**
     *
     * @returns {Promise<CountryController>}
     */
    static async build() {
        const continentsObj = await CountryController.getContinentsData();

        document.querySelector(".lds-roller").style.display = "none";
        document.querySelector(".chart-container").style.display = "block";

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
            console.error(err);
        }
    };

    /**
     *
     * @returns {Promise<{"":Country[],Africa:Country[],Americas:Country[],Asia:Country[],Europe:Country[], Oceania:Country[]}>}
     */

    static getContinentsData = async () => {
        try {
            if (
                LocalStorageWrapper.getWithExpiry(
                    CountryController.CONTINENTS_OBJ_IDENTIFIER
                )
            ) {
                return JSON.parse(
                    LocalStorageWrapper.getWithExpiry(
                        CountryController.CONTINENTS_OBJ_IDENTIFIER
                    )
                );
            }

            const data = await Utils.getFetchedData(
                "https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1"
            );
            const countriesArr = await CountryController.getArrOfCountries();
            const continentsObj = data.reduce((acc, country) => {
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

            LocalStorageWrapper.setWithExpiry(
                CountryController.CONTINENTS_OBJ_IDENTIFIER,
                JSON.stringify(continentsObj),
                TimeUtils.hoursToMilliSeconds(10)
            );

            return continentsObj;
        } catch (err) {
            console.error(err);
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

    changeListenerToSelectedCountry = (selectedCountry) => {
        this.countryUI.drawCountryLatestDataChart(
            selectedCountry,
            this.continents
        );
        this.countryUI.drawCountryTodayDataChart(
            selectedCountry,
            this.continents
        );
        document.querySelector(".country-chart").style.display = "flex";
    };

    initializeView = () => {
        this.addEventToCountriesBtn();
        this.closeDropdownWhenClickOnWindow();
        this.countryUI.chartsFactory.drawContinentsChart(
            this.continents,
            "Africa"
        );
        this.countryUI.createDropdownCountriesElements(
            this.continents,
            "Africa"
        );
        this.countryUI.continentSelector.selectedContinent.addChangeListener(
            (selectedContinent) =>
                this.countryUI.chartsFactory.drawContinentsChart(
                    this.continents,
                    selectedContinent,
                    "critical"
                )
        );
        this.countryUI.continentSelector.selectedContinent.addChangeListener(
            (selectedContinent) =>
                this.countryUI.createDropdownCountriesElements(
                    this.continents,
                    selectedContinent
                )
        );
        this.countryUI.continentSelector.selectedContinent.addChangeListener(
            () => {
                this.countryUI.initializeCharts(
                    this.changeListenerToSelectedCountry
                );
            }
        );

        this.countryUI.countrySelector.selectedCountry.addChangeListener(
            this.changeListenerToSelectedCountry
        );
    };

    addEventToCountriesBtn = () => {
        this.countryUI.countriesDropdownBtn.addEventListener("click", (e) => {
            this.countryUI.countriesDropdownMenu.classList.toggle("show");
        });
        // document.querySelector(".fa-caret-down").addEventListener("click", (e) => {
        //     this.countryUI.countriesDropdownMenu.classList.toggle("show");
        // });
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
